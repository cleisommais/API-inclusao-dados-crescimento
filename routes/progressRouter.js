import express from 'express';
import progressModel from '../model/progressModel';
import jwt from 'jsonwebtoken';
const progressRouter = express.Router();

progressRouter
  .route('/')
  .get((req, resp) => {
    try {
      let token = req.headers['token'];
      if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          if (err) {
            resp.statusMessage = 'Unauthorized';
            resp.status(401).json({
              codigo: '2',
              mensagem: 'Token invalido, inexistente ou expirado'
            });
          } else if (decoded) {
            progressModel.find({}, (err, progress) => {
              if (err) {
                resp.statusMessage = 'Bad request';
                resp.status(400).json({
                  codigo: '3',
                  mensagem: 'Dados request enviados incorretos'
                });
              } else {
                resp.statusMessage = 'OK';
                resp.status(200).json(progress);
              }
            });
          }
        });
      } else {
        resp.statusMessage = 'Unauthorized';
        resp.status(401).json({
          codigo: '2',
          mensagem: 'Token invalido, inexistente ou expirado'
        });
      }
    } catch (error) {
      console.error(error);
      resp.statusMessage = 'Internal error';
      resp.status(500).json({
        codigo: '1',
        mensagem: 'Erro no servidor'
      });
    }
  })
  .post((req, resp) => {
    try {
      let token = req.headers['token'];
      if (token) {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          if (err) {
            resp.statusMessage = 'Unauthorized';
            resp.status(401).json({
              codigo: '2',
              mensagem: 'Token invalido, inexistente ou expirado'
            });
          } else if (decoded) {
            let progress = new progressModel(req.body);
            progress.save(err => {
              if (err) {
                console.error(err);
                resp.statusMessage = 'Bad request';
                resp.status(400).json({
                  codigo: '3',
                  mensagem: 'Dados request enviados incorretos'
                });
              } else {
                resp.statusMessage = 'Criado';
                resp.status(201).json(progress);
              }
            });
          }
        });
      } else {
        resp.statusMessage = 'Unauthorized';
        resp.status(401).json({
          codigo: '2',
          mensagem: 'Token invalido, inexistente ou expirado'
        });
      }
    } catch (error) {
      console.error(error);
      resp.statusMessage = 'Internal error';
      resp.status(500).json({
        codigo: '1',
        mensagem: 'Erro no servidor'
      });
    }
  });

progressRouter.use('/:id', (req, resp, next) => {
  try {
    let token = req.headers['token'];
    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          resp.statusMessage = 'Unauthorized';
          resp.status(401).json({
            codigo: '2',
            mensagem: 'Token invalido, inexistente ou expirado'
          });
        } else if (decoded) {
          progressModel.findById(req.params.id, (err, progress) => {
            if (err) {
              resp.statusMessage = 'Bad request';
              resp.status(400).json({
                codigo: '3',
                mensagem: 'Dados request enviados incorretos'
              });
            } else if (!progress) {
              resp.statusMessage = 'Not found';
              resp.status(404).json({
                codigo: '4',
                mensagem: `Recurso ${req.params.id} não encontrado`
              });
            } else {
              req.progress = progress;
              next();
            }
          });
        }
      });
    } else {
      resp.statusMessage = 'Unauthorized';
      resp.status(401).json({
        codigo: '2',
        mensagem: 'Token invalido, inexistente ou expirado'
      });
    }
  } catch (error) {
    console.error(error);
    resp.statusMessage = 'Internal error';
    resp.status(500).json({
      codigo: '1',
      mensagem: 'Erro no servidor'
    });
  }
});
progressRouter
  .route('/:id')
  .get((req, resp) => {
    resp.statusMessage = 'OK';
    resp.status(200).json(req.progress);
  })
  .put((req, resp) => {
    req.progress.height = req.body.height;
    req.progress.weight = req.body.weight;
    req.progress.headCircumference = req.body.headCircumference;
    req.progress.dateProgress = req.body.dateProgress;
    req.progress.account.id = req.body.account.id;
    req.progress.account.firstName = req.body.account.firstName;
    req.progress.account.lastName = req.body.account.lastName;
    req.progress.account.email = req.body.account.email;
    req.progress.account.dateBirth = req.body.account.dateBirth;
    req.progress.account.gender = req.body.account.gender;
    req.progress.save(err => {
      if (err) {
        console.error(err);
        resp.statusMessage = 'Bad request';
        resp.status(400).json({
          codigo: '3',
          mensagem: 'Dados request enviados incorretos'
        });
      } else {
        resp.statusMessage = 'Aceito';
        resp.status(202).send('');
      }
    });
  })
  .delete((req, resp) => {
    req.progress.remove(err => {
      if (err) {
        console.error(err);
        resp.statusMessage = 'Bad request';
        resp.status(400).json({
          codigo: '3',
          mensagem: 'Dados request enviados incorretos'
        });
      } else {
        resp.statusMessage = 'Sem conteúdo';
        resp.status(204).send('');
      }
    });
  });
export default progressRouter;