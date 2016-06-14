var _={};
_.ajax = function(url,callback){
	var xhr = new XMLHttpRequest();
	xhr.addEventListener('readystatechange',function(){
		if(this.readyState!== 4){
			return;
		}
		if(this.status === 200 || this.status===304){
			callback(this.response)
		}
	})
	xhr.open('get',url,true);
	xhr.send()
}












// var $={};
// $.ajax = function(url,callback){
// 	var xhr = new XMLHttpRequest();
// 	xhr.addEventListener('readystatechange',function(){
// 		if(this.readyState!== 4){
// 			return;
// 		}
// 		if(this.status === 200 || this.status===304){
// 			callback(this.response)
// 		}
// 	})
// 	xhr.open('get',url,true);
// 	xhr.send()
// }
