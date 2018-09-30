

var middleware =(req,res,next)=>{
	 this.setcurrentNodeURL(req.protocol+"://"+req.get('host'));
	 next();
}

module.exports = {middleware};