var  ads= ['7408205', '7408208', '7408206','7408125']
var index=0
const getAd= function(){
    let length= ads.length
    let ad= ads[index]
    index+=1
    if(index>=4){
        return ''
    }
    return ad
 }


 module.exports ={
    getAd:getAd
 }