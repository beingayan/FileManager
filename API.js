contentSharing.get("/document/gethomeWorkFiles",checkToken,async(req,res)=>{
    var appData = {
      data:[],
      msg:'',
      success:false
    }
  
    var query = npEscape(database.queryPreFix(req.db)+ contentSharingQueries.get_hm_FolderWithPath);
  
    queryEngine.query(query).then((rows)=>{
  var dataLoop = rows[1];
  var treeArr = [];
  
  
  var createArr = async(props)=>{
   props.map((i)=>{
    dataLoop.map((d)=>{
      if(parseInt(i.subjId)=== parseInt(d.subjId)){
        i.children.push({extension:d.extension,file_location:d.file_location,title:d.homeWorkName,type:"FILE",fileName:d.homeWorkName})
      }
    })
   })
  }
  if(dataLoop.length>0){
    dataLoop.map((i)=>{
      treeArr.push({SubjectName:i.SubjectName,subjId:i.subjId,children:[],AcadCombId:i.AcadCombId,AcadTranId:i.AcadTranId,acYearId:i.acYearId,type:"FOLDER"})
    });
  
    treeArr = _.uniqBy(treeArr,'subjId');
  createArr(treeArr)
  
  }
      console.log("rows-->",treeArr)
      appData['data'] = treeArr;
      appData['msg']= "Data fetched successfully";
      appData['success'] = true
  
      res.status(201).json(appData);
    }).catch((err)=>{
      console.log("err",err);
      appData['data']= err;
      appData['msg'] = "Something went wrong";
      appData['success'] = false;
  
      res.status(400).json(appData)
    })
  })
  