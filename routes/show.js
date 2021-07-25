const express=require('express')
const File=require('../models/file')
const router=express.Router()

router.get('/:uuid',async(req,res)=>{

    try{
        const file=await File.findOne({uuid:req.params.uuid})
        if(!file){
            return res.render('download',{error:'Link has been expired'})
        }
        return res.render('download',{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size,
            downloadLink:`${process.env.HOST}/files/download/${file.uuid}`
        })
    }
    catch{
        return res.render('download',{error:'Something went wrong'})
    }
})


module.exports=router