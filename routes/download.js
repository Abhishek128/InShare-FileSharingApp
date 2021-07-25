const express=require('express')
const File=require('../models/file')
const router=express.Router()

router.get('/:uuid',async(req,res)=>{

    const file=await File.findOne({uuid:req.params.uuid})
    if(!file){
        return res.render('download',{error:'Link has been expired'})
    }

    const response=await file.save()
    const filePath=`${__dirname}/../${response.path}`
    res.download(filePath)
})


module.exports=router