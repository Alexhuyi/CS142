'use strict'; 

function Cs142TemplateProcessor(template){
  this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){
  const reg1 = /{{[^\s]+}}/g;
  const found = this.template.match(reg1);
  for (let i = 0; i < found.length; i++) {
    if (Object.prototype.hasOwnProperty.call(dictionary,found[i].slice(2,-2))){
      this.template = this.template.replace(found[i],dictionary[found[i].slice(2,-2)]);
    }
    else{
      this.template = this.template.replace(found[i],"");
    }
  }
  return this.template;
};