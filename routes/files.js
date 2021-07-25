const express=require('express')
const router=express.Router()
const path=require('path')
const File=require('../models/file')
const multer=require('multer')
const {v4:uuidv4}=require('uuid')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    } 
})

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }}).single('myfile')

router.post('/',async(req,res)=>{
    
    upload(req,res,async(err)=>{
        if(err){
            return res.status(500).send({error:err.message})
        }

        const file=new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        })

        const response=await file.save()
        res.json({file:`${process.env.HOST}/files/${response.uuid}`})
    })
})

router.post('/send', async (req, res) => {

    const { uuid, emailTo, emailFrom, expiresIn } = req.body
    
    if(!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry'})
    }
    
    try {

      const file = await File.findOne({ uuid: uuid });
      
      const sendMail = require('../services/email');
      sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you.`,
        html: require('../services/emailTemplate')({
                  emailFrom, 
                  downloadLink: `${process.env.HOST}/files/${file.uuid}?source=email` ,
                  size: parseInt(file.size/1000) + ' KB',
                  expires: '24 hours'
              })
      }).then(() => {
            return res.json({success: true})
      }).catch(err => {
            return res.status(500).json({error: 'Error in email sending.'})
      })
    } 
    catch(err) {
            return res.status(500).send({ error: 'Something went wrong.'})
    }
  
  })

module.exports=router