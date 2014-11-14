
collections= [new Mongo.Collection("items1"),new Mongo.Collection("items2"),new Mongo.Collection("items3",{
  transform: function (doc) {
    doc.test=function(){
      console.log("hello from collection items3")
      };
      return doc; }
})]


var schema=new SimpleSchema({
  title:{
    type:String
  },
  updated:{
    type:Boolean,
    optional:true
  }
})


collections.forEach(function(c){

  if(c._name!="items3")//add helper to items1 and items2
  c.helpers({
    "test":function()
    {
      console.log("hello from collection "+c._name)
    }
  })

  if(c._name!="items2")//add schema to items1 and items3
    c.attachSchema(schema,{transform: true})

  //add allow to all collections
  c.allow({
    insert:function(userId,doc)
    {
      console.log("insert",doc)
      return true
    },
    update:function(userId,doc,fields,modifiers)
    {
      console.log("update",doc)
      doc.test()
      return false
    },
    remove:function(userId,doc)
    {
      return true
    }
  })

})


if (Meteor.isClient) {
  collections.forEach(function(c){
    var id=c.insert({title:c._name})
    c.update(id,{$set:{updated:true}},function(err){
      if(err)
        {
          console.error("update failed with collection ",c._name)
          console.error(err)
        }
        else{
          console.log("update succeed with collection ",c._name)
        }
    })
  })

}
