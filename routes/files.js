const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});

router.post('/send', async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'FileTransfer Web Application',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
                size: parseInt(file.size/1000) + ' KB',
                expiresIn: '24 hours'
            })
    }).then(() => {
      return res.json({success: true});
    }).catch(err => {
      return res.status(500).json({error: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).send({ error: 'Something went wrong.'});
}

});

module.exports = router;













// const router = require('express').Router();
// const multer = require('multer');
// const path = require('path');
// const File = require('../models/file');
// const { v4: uuid4 } = require('uuid');

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/') ,
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
//               cb(null, uniqueName)
//     } ,
// });

// let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

// router.post('/', (req, res) => {
//     if(!req.file){
//          return res.json({ error: 'All fields are required'});
//          }

//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(500).send({ error: err.message });
//       }
//         const file = new File({
//             filename: req.file.filename,
//             uuid: uuid4(),
//             path: req.file.path,
//             size: req.file.size
//         });
//         const response = await file.save();
//         res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
//       });



// });

// router.post('/send', async (req, res) => {
//   const { uuid, emailTo, emailFrom, expiresIn } = req.body;
//   if(!uuid || !emailTo || !emailFrom) {
//       return res.status(422).send({ error: 'All fields are required except expiry.'});
//   }
//   // Get data from db 
  
//     const file = await File.findOne({ uuid: uuid });
//     // if(file.sender) {
//     //   return res.status(422).send({ error: 'Email already sent once.'});
//     // }
//     file.sender = emailFrom;
//     file.receiver = emailTo;
//     const response = await file.save();
//     // send mail
//     const sendMail = require('../services/emailService');
//     sendMail({
//       from: emailFrom,
//       to: emailTo,
//       subject: 'FileTransfer Web Application',
//       text: `${emailFrom} shared a file with you.`,
//       html: require('../services/emailTemplate')({
//                 emailFrom, 
//                 downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
//                 size: parseInt(file.size/1000) + ' KB',
//                 expires: '24 hours'
//             })

//           });
//           return res.send({ success: true });

//         });
          



// //     }).then(() => {
// //       return res.json({success: true});
// //     }).catch(err => {
// //       return res.status(500).json({error: 'Error in email sending.'});
// //     });
// // } catch(err) {
// //   return res.status(500).send({ error: 'Something went wrong.'});
// // }













// // const router = require('express').Router();
// // const multer = require('multer');

// // const path = require('path');

// // const File = require('../models/file');

// // const{ v4: uuid4 } = require('uuid');


// // let storage = multer.diskStorage({
// //     destination : (req, file, cb) => cb(null, 'uploads/'),
// //     filename: (req, file, cb) => {
// //         const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
// //         cb(null, uniquename);
// //     }
// // })


// // let upload = multer({
// //     storage: storage,
// //     limit: {fileSize: 1000000 * 100},
// // }).single('myfile');


// // router.post('/', (req, res) =>{
// //     // Validate request

// //     // if(!req.file){
// //     //     return res.json({ error: 'All fields are required'});
// //     // }


// //     // Store the files
// //     upload(req, res, async (err) =>{
// //         if(err){
// //             return res.status(500).send({ error: err.message })
// //         }
// //         // Store into the Database
// //         const file = new File({
// //             filename: req.file.filename,
// //             uuid: uuid4(),
// //             path: req.file.path,
// //             size: req.file.size
         
// //         });

// //         const response = await file.save();
// //         return res.json({ file: `{process.env.APP_BASE_URL}/files/${response.uuid}` });

// //     });


    




// //     //Response
// // });

// module.exports = router;