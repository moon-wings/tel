$(function(){

 ///////////声明绘制页面所需要的变量
	var contacts=[];

	$contact = $('.contact');
	$findList = $('.findlist');
	$ul = $findList.children().eq(0);
	$consub = $('.consub');
	$tip = $('.card-info');
	$card = $tip.children().eq(0);
	$del = $('.delete');
	$cancle = $('.cancle');
	$add = $('.add');

///////////获取所有联系人  构建核心数据结构
	if(localStorage.data){
   		contacts=JSON.parse(localStorage.data);             
   		render();
   }else{
   		_.ajax('/tel/php/huoqulianxiren.php',function(data){ 
   			contacts=JSON.parse(data);                                 
		    localStorage.data = JSON.stringify(contacts);              
   			render();                                                   
   		})   
   }
///////////一个渲染函数，根据数据绘制页面

   function render(){

   		$contact.empty();
   		$ul.empty();
   	   

	   var dict={};
	   contacts.forEach(function(v){
	   	   var k=v.name[0].toUpperCase();
	   	   if(!dict[k]){
	   	   	dict[k]=[];
	   	   } 
	   	   dict[k].push(v);
	   })

	   var zimuliebiao=Object.keys(dict).sort();
	   zimuliebiao.forEach(function(v){
	   	   $ul.append('<li><a href="#'+v+'">'+v+'</a></li>');
	   	   $contact.append('<dt class="tit" id="'+v+'">'+v+'</dt>');
	   	   var data=dict[v];
	   	   data.forEach(function(v){
		   	   var p1=v.phone.slice(0,3);
			   var p2=v.phone.slice(3,7);
			   var p3=v.phone.slice(7);
		   	   $contact.append('<dd class="con" data-id="'+v.id+'"><div class="consub"><span class="name button">'+v.name+'</span><span class="phoneNum button">'+p1+'－'+p2+'－'+p3+'</span><a href="#" aa='+v.id+' bb='+v.name+' cc='+v.phone+'></a></div></dd>');
	   	   })

	   })
	   $findList.height($ul.outerHeight(true));

   }
///////////页面中效果处理
//同步联系人

	   var fresh=$('.fresh');
	   fresh.bind('touchstart',function(){
	   		var _d=[];
	   		_.ajax('/tel/php/huoqulianxiren.php',function(data){          
				_d=JSON.parse(data);
				if(_d.length!==contacts.length){                                
					contacts=_d;                                                 
					localStorage.data=JSON.stringify(contacts);                  
				}
				render();                                                        
			}) 
	   })

//finish
		var inputName = $('input[name=name]');
		var inputPhone = $('input[name=phone]');
		var inputBeizhu = $('input[name=beizhu]');


		var hide=function(){
			$tip.css({display:"none"})
			finish.removeClass('xinzeng');
			finish.removeClass('gengxin');
			inputName.val('');
			inputPhone.val('');
			inputBeizhu.val('');
			$del.css({display:"block"})
		}
		var show=function(){
			$tip.css({display:"block"})
		}

		$contact.bind('touchstart',show);
		
		$tip.bind('touchstart',hide);
		
		$card.bind('touchstart',function(e){
			e.stopPropagation();
		});
		
		$del.bind('touchstart',hide);
		
		$cancle.bind('touchstart',hide);

		
		$add.bind('touchstart',show);
		$add.bind('touchstart',function(){
			$del.css({display:"none"});
			finish.addClass('xinzeng')
		})

// add	判断更新还是新增 通过不同的类	   
		var finish=$('.finish');
		finish.bind('touchstart',function(){
		    var name=inputName.val();
		    var phone=inputPhone.val();
		    var beizhu=inputBeizhu.val();
		    // var id=$(this).attr('data-id');
		    // console.log(id)
		   if($(this).hasClass('xinzeng')){
		   		var url='/tel/php/addlianxiren.php?name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
		   		if(!name || !phone){                                                          
		   			hide();
		   			return;
		   		}
		   		finish.html('waiting...');
				_.ajax(url,function(data){
					contacts.push({id:data,name:name,phone:phone,beizhu:beizhu});               
					localStorage.data=JSON.stringify(contacts);                                
					finish.html('完成');
					hide();
					render();                                                                  
				})
				// console.log(id,name,phone,beizhu)
		   }else if($(this).hasClass('gengxin')){
			    var id=$(this).attr('data-id');
			    // console.log(id)
				// console.log(id,name,phone,beizhu)
		   		var url='/tel/php/gengxinlianxiren.php?id='+id+'&name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
		   		_.ajax(url,function(data){
		   			contacts.forEach(function(v){                                             
			   			if(v.id===id){
			   				v.name=name;
			   				v.phone=phone;
			   				v.beizhu=beizhu;
			   		        localStorage.data=JSON.stringify(contacts);
		   			        render();
			   			}
		   			})
		   			hide();
		   		})
		   }
		})

// delete
		$del.bind('touchstart',function(){
			var id=$(this).attr('data-id');
			console.log(id)
			$del.html("fighting...")
			_.ajax('/tel/php/shanchulianxiren.php?id='+id,function(data){
				// console.log(data)
				$del.html("删除");
				render();
				localStorage.data=JSON.stringify(contacts);
				hide();
			})

	   		_.ajax('/tel/php/huoqulianxiren.php',function(data){
				var _d=JSON.parse(data);
				if(_d.length!== contacts.length){
					contacts=_d;
					localStorage.data=JSON.stringify(contacts);
				}
				    render();
			}) 

		})


//update		
		$contact.delegate('a','touchstart',function(e){
			finish.addClass('gengxin');
			$del.css({display:"block"});
			
			var el = e.target;                                                
			var id = $(el).attr('aa');
			$del.attr('data-id',id);
			finish.attr('data-id',id);
			var tmp=contacts.filter(function(v){                              
				return v.id===id;                                  
			})
			show();
			inputName.val(tmp[0].name);
			inputPhone.val(tmp[0].phone);
			inputBeizhu.val(tmp[0].beizhu);
		})



})









// ///////////声明绘制页面所需要的变量
//    var contacts=[];

//    var contact=document.querySelector('.contact');
//    var findlist=document.querySelector('.findlist');
//    var ul=findlist.querySelector('ul');
//    var consub=document.querySelector('.consub');
//    var tip=document.querySelector('.card-info');
//    var card=tip.firstElementChild;
//    var del=card.querySelector('.delete');
//    var cancle=document.querySelector('.cancle');
//    var add=document.querySelector('.add');

// ///////////获取所有联系人  构建核心数据结构
//    if(localStorage.data){
//    		contacts=JSON.parse(localStorage.data);                         //如果有本地数据，就把本地数据给了conta，并重新渲染页面
//    		render();
//    }else{
//    		$.ajax('/php/huoqulianxiren.php',function(data){                //如果本地没有数据，就从数据库获取数据
//    			contacts=JSON.parse(data);                                  //把数据库数据给了contacts并从一个字符串中解析出json对象
// 		    localStorage.data = JSON.stringify(contacts);               //把contacts解析成字符串
//    			render();                                                   //重新渲染页面
//    		})   
//    }


// ///////////一个渲染函数，根据数据绘制页面

//    function render(){

//    	   contact.innerHTML='';                                            //清空页面数据
// 	   ul.innerHTML='';                                                 //清空滚动条数据

// 	   var dict={};
// 	   contacts.forEach(function(v){
// 	   	   var k=v.name[0].toUpperCase();
// 	   	   if(!dict[k]){
// 	   	   	dict[k]=[];
// 	   	   } 
// 	   	   dict[k].push(v);
// 	   })

// 	   var zimuliebiao=Object.keys(dict).sort();
// 	   zimuliebiao.forEach(function(v){
// 	   	   var li=document.createElement('li');
// 	   	   li.innerHTML='<a href="#'+v+'">'+v+'</a>';
// 	   	   ul.appendChild(li);

// 	   	   var dt=document.createElement('dt');
// 	   	   dt.innerHTML=v;
// 	   	   dt.id=v;
// 	   	   dt.classList.add('tit')
// 	   	   contact.appendChild(dt);

// 	   	   var data=dict[v];
// 	   	   data.forEach(function(v){
// 		   	   var dd=document.createElement('dd');
// 		   	   var p1=v.phone.slice(0,3);
// 			   var p2=v.phone.slice(3,7);
// 			   var p3=v.phone.slice(7);
// 		   	   dd.innerHTML='<div class="consub"><span class="name button">'+v.name+'</span><span class="phoneNum button">'+p1+'－'+p2+'－'+p3+'</span><a href="#" aa='+v.id+' bb='+v.name+' cc='+v.phone+'></a></div>';
// 		   	   dd.classList.add('con');
// 		   	   dd.setAttribute('data-id',v.id);
// 		   	   contact.appendChild(dd);
// 	   	   })

// 	   })
// 	   findlist.style.height=ul.offsetHeight+"px";

//    }


// ///////////页面中效果处理
// //同步联系人

// 	   var fresh=document.querySelector('.fresh');
// 	   fresh.addEventListener('touchstart',function(){
// 	   		var _d=[];
// 	   		$.ajax('/php/huoqulianxiren.php',function(data){          
// 				_d=JSON.parse(data);
// 				if(_d.length!==contacts.length){                                 //比较从数据库获取的数据长度是否相等
// 					contacts=_d;                                                 //不一样的话给了contacts
// 					localStorage.data=JSON.stringify(contacts);                  //存储到本地
// 				}
// 				render();                                                        //渲染页面
// 			}) 
// 	   })

// //finish
// 		var inputName = card.querySelector('input[name=name]');                  //获取input框
// 		var inputPhone = card.querySelector('input[name=phone]');
// 		var inputBeizhu = card.querySelector('input[name=beizhu]');


// 		var hide=function(){
// 			tip.style.display="none";
// 			finish.classList.remove('xinzeng');
// 			finish.classList.remove('gengxin');
// 			inputName.value=inputPhone.value=inputBeizhu.value='';
// 			del.style.display="block"
// 		}
// 		var show=function(){
// 			tip.style.display="block"
// 		}
// 		var stop=function(e){
// 			e.stopPropagation();
// 		}

// 		contact.addEventListener('touchstart',show);
		
// 		tip.addEventListener('touchstart',hide);
		
// 		card.addEventListener('touchstart',stop);
		
// 		del.addEventListener('touchstart',hide);
		
// 		cancle.addEventListener('touchstart',hide);

		
// 		add.addEventListener('touchstart',show);
// 		add.addEventListener('touchstart',function(){
// 			del.style.display="none";
// 			finish.classList.add('xinzeng')
// 		})


	   
// // add	判断更新还是新增 通过不同的类	   
// 		var finish=document.querySelector('.finish');
// 		finish.addEventListener('touchstart',function(){
// 		    var name=inputName.value;
// 		    var phone=inputPhone.value;
// 		    var beizhu=inputBeizhu.value;
// 		    var id=this.getAttribute('data-id');
// 		   if(this.classList.contains('xinzeng')){
// 		   		var url='/php/addlianxiren.php?name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
// 		   		if(!name || !phone){                                                           //保证都填写，不为空
// 		   			hide();
// 		   			return;
// 		   		}
// 		   		finish.innerHTML='waiting...'
// 				$.ajax(url,function(data){
// 					contacts.push({id:data,name:name,phone:phone,beizhu:beizhu});               //向contacts追加新增数据
// 					localStorage.data=JSON.stringify(contacts);                                 //保存数据
// 					finish.innerHTML='ok';
// 					hide();
// 					render();                                                                   //每次都要重新渲染页面
// 				})
// 				// console.log(id,name,phone,beizhu)
// 		   }else if(this.classList.contains('gengxin')){
// 				// console.log(id,name,phone,beizhu)
// 		   		var url='/php/gengxinlianxiren.php?id='+id+'&name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
// 		   		$.ajax(url,function(data){
// 		   			contacts.forEach(function(v){                                              //遍历contacts重新赋值
// 			   			if(v.id===id){
// 			   				v.name=name;
// 			   				v.phone=phone;
// 			   				v.beizhu=beizhu;
// 			   		        localStorage.data=JSON.stringify(contacts);
// 		   			        render();
// 			   			}
// 		   			})
// 		   			hide();
// 		   		})
// 		   }
// 		})


// // delete
// 		del.addEventListener('touchstart',function(){
// 			var id=this.getAttribute('data-id');
// 			del.innerHTML="fighting..."
// 			$.ajax('/php/shanchulianxiren.php?id='+id,function(data){
// 				// console.log(data)
// 				del.innerHTML="delete";
// 				// console.log(del);
// 				render();
// 				localStorage.data=JSON.stringify(contacts);
// 				hide();
// 			})

// 	   		$.ajax('/php/huoqulianxiren.php',function(data){
// 				var _d=JSON.parse(data);
// 				if(_d.length!== contacts.length){
// 					contacts=_d;
// 					localStorage.data=JSON.stringify(contacts);
// 				    render();
// 				}
// 			}) 

// 		})


// //update		
// 		contact.addEventListener('touchstart',function(e){
// 			finish.classList.add('gengxin');
// 			del.style.display='block';
			
// 			var el = e.target;                                                 //   e.target
// 			var id = el.getAttribute('aa');
// 			del.setAttribute('data-id',id);
// 			finish.setAttribute('data-id',id);
// 			var tmp=contacts.filter(function(v){                                //保留相等的
// 				return v.id===id;                                  
// 			})
// 			show();
// 			inputName.value = tmp[0].name;
// 			inputPhone.value = tmp[0].phone;
// 			inputBeizhu.value = tmp[0].beizhu;
// 		})


		
	






















//过滤 为真保留
// 删除 点开联系人，拿到ID（a），设置value




//1.获取到所有的联系人 => 数组中
    // 如果本地有数据&&本地的数据和数据库一致，
    // 把本地存储的数据【转成数组，获取的是字符串】放到数组中,调用渲染函数(不能放在外边，因为异步问题)
    // 如果本地没有数据，发送一次AJAX请求，从数据到或取到信息放到数组中 ，调用渲染函数。和上面一样
    // （提示用户初始化中，请等待，一段时间没有成功之后，若没有成功，换一个提示）


//2.把数据渲染到页面中
  //   先把联系人列表和右侧都清空
  //   然后分析数组中的数据，右侧按照字母从小到大，列出所有联系人的字母
  //   左侧列表中按照字母分组提示所有的联系人
  //   县遍历数组，构造字典 {k:[x1,x2]}
  //   遍历字典，用键取绘制右侧 和 左侧的头部    用值去绘制联系人列表


//3.展示效果
	// 点击右侧，左边切换
	// 在右侧滑动，左侧切换
	// 左侧滑动时候，分组信息要position：absolute留在顶部，实时更换


//4.CURD
// create 点击+号，弹出窗口，编辑电话和姓名
//        点击完成后，发送一次ajax请求，把信息存储到数据库
//        然后服务器会返回ID 我们把ID+电话+姓名, 保存到我们的数组中，同时也保存到本地种
//        重新绘制一次页面
// delete 在列表向左滑动，出现删除按钮，点击删除
		  // 发送ajax请求，把ID发过去，从数组中删掉这个ID的数据
		  // 重新绘制一次页面
//update 点击每一个条目，弹出一个窗口
		 // 在窗口中展示电话和姓名以及备注
		 // 添加一个编辑按钮，点击唐所有的条目可编辑
		 // 点击完成的时候吧数据发给服务器
		 // 同时把数组中的数据也换掉
		 // 重新绘制页面
//read   先把所有数据取出来，和页面中的数据匹配
		// 如果没有变化，什么都不做
		// 如果有变化，页面中的数组换成服务器取回来的那个数组
		// 重新绘制页面




































































// ///////////声明绘制页面所需要的变量
//    var contacts=[];

//    var contact=document.querySelector('.contact');
//    var findlist=document.querySelector('.findlist');
//    var ul=findlist.querySelector('ul');
//    var consub=document.querySelector('.consub');
//    var tip=document.querySelector('.card-info');
//    var card=tip.firstElementChild;
//    var del=card.querySelector('.delete');
//    var cancle=document.querySelector('.cancle');
//    var add=document.querySelector('.add');

// ///////////获取所有联系人  构建核心数据结构
//    if(localStorage.data){
//    		contacts=JSON.parse(localStorage.data);                         //如果有本地数据，就把本地数据给了conta，并重新渲染页面
//    		render();
//    }else{
//    		$.ajax('/php/huoqulianxiren.php',function(data){                //如果本地没有数据，就从数据库获取数据
//    			contacts=JSON.parse(data);                                  //把数据库数据给了contacts并从一个字符串中解析出json对象
// 		    localStorage.data = JSON.stringify(contacts);               //把contacts解析成字符串
//    			render();                                                   //重新渲染页面
//    		})   
//    }


// ///////////一个渲染函数，根据数据绘制页面

//    function render(){

//    	   contact.innerHTML='';                                            //清空页面数据
// 	   ul.innerHTML='';                                                 //清空滚动条数据

// 	   var dict={};
// 	   contacts.forEach(function(v){
// 	   	   var k=v.name[0].toUpperCase();
// 	   	   if(!dict[k]){
// 	   	   	dict[k]=[];
// 	   	   } 
// 	   	   dict[k].push(v);
// 	   })

// 	   var zimuliebiao=Object.keys(dict).sort();
// 	   zimuliebiao.forEach(function(v){
// 	   	   var li=document.createElement('li');
// 	   	   li.innerHTML='<a href="#'+v+'">'+v+'</a>';
// 	   	   ul.appendChild(li);

// 	   	   var dt=document.createElement('dt');
// 	   	   dt.innerHTML=v;
// 	   	   dt.id=v;
// 	   	   dt.classList.add('tit')
// 	   	   contact.appendChild(dt);

// 	   	   var data=dict[v];
// 	   	   data.forEach(function(v){
// 		   	   var dd=document.createElement('dd');
// 		   	   var p1=v.phone.slice(0,3);
// 			   var p2=v.phone.slice(3,7);
// 			   var p3=v.phone.slice(7);
// 		   	   dd.innerHTML='<div class="consub"><span class="name button">'+v.name+'</span><span class="phoneNum button">'+p1+'－'+p2+'－'+p3+'</span><a href="#" aa='+v.id+' bb='+v.name+' cc='+v.phone+'></a></div>';
// 		   	   dd.classList.add('con');
// 		   	   dd.setAttribute('data-id',v.id);
// 		   	   contact.appendChild(dd);
// 	   	   })

// 	   })
// 	   findlist.style.height=ul.offsetHeight+"px";

//    }


// ///////////页面中效果处理
// //同步联系人

// 	   var fresh=document.querySelector('.fresh');
// 	   fresh.addEventListener('touchstart',function(){
// 	   		var _d=[];
// 	   		$.ajax('/php/huoqulianxiren.php',function(data){          
// 				_d=JSON.parse(data);
// 				if(_d.length!==contacts.length){                                 //比较从数据库获取的数据长度是否相等
// 					contacts=_d;                                                 //不一样的话给了contacts
// 					localStorage.data=JSON.stringify(contacts);                  //存储到本地
// 				}
// 				render();                                                        //渲染页面
// 			}) 
// 	   })

// //finish
// 		var inputName = card.querySelector('input[name=name]');                  //获取input框
// 		var inputPhone = card.querySelector('input[name=phone]');
// 		var inputBeizhu = card.querySelector('input[name=beizhu]');


// 		var hide=function(){
// 			tip.style.display="none";
// 			finish.classList.remove('xinzeng');
// 			finish.classList.remove('gengxin');
// 			inputName.value=inputPhone.value=inputBeizhu.value='';
// 			del.style.display="block"
// 		}
// 		var show=function(){
// 			tip.style.display="block"
// 		}
// 		var stop=function(e){
// 			e.stopPropagation();
// 		}

// 		contact.addEventListener('touchstart',show);
		
// 		tip.addEventListener('touchstart',hide);
		
// 		card.addEventListener('touchstart',stop);
		
// 		del.addEventListener('touchstart',hide);
		
// 		cancle.addEventListener('touchstart',hide);

		
// 		add.addEventListener('touchstart',show);
// 		add.addEventListener('touchstart',function(){
// 			del.style.display="none";
// 			finish.classList.add('xinzeng')
// 		})


	   
// // add	判断更新还是新增 通过不同的类	   
// 		var finish=document.querySelector('.finish');
// 		finish.addEventListener('touchstart',function(){
// 		    var name=inputName.value;
// 		    var phone=inputPhone.value;
// 		    var beizhu=inputBeizhu.value;
// 		    var id=this.getAttribute('data-id');
// 		   if(this.classList.contains('xinzeng')){
// 		   		var url='/php/addlianxiren.php?name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
// 		   		if(!name || !phone){                                                           //保证都填写，不为空
// 		   			hide();
// 		   			return;
// 		   		}
// 		   		finish.innerHTML='waiting...'
// 				$.ajax(url,function(data){
// 					contacts.push({id:data,name:name,phone:phone,beizhu:beizhu});               //向contacts追加新增数据
// 					localStorage.data=JSON.stringify(contacts);                                 //保存数据
// 					finish.innerHTML='ok';
// 					hide();
// 					render();                                                                   //每次都要重新渲染页面
// 				})
// 				// console.log(id,name,phone,beizhu)
// 		   }else if(this.classList.contains('gengxin')){
// 				// console.log(id,name,phone,beizhu)
// 		   		var url='/php/gengxinlianxiren.php?id='+id+'&name='+name+'&phone='+phone+'&beizhu='+beizhu+'';
// 		   		$.ajax(url,function(data){
// 		   			contacts.forEach(function(v){                                              //遍历contacts重新赋值
// 			   			if(v.id===id){
// 			   				v.name=name;
// 			   				v.phone=phone;
// 			   				v.beizhu=beizhu;
// 			   		        localStorage.data=JSON.stringify(contacts);
// 		   			        render();
// 			   			}
// 		   			})
// 		   			hide();
// 		   		})
// 		   }
// 		})


// // delete
// 		del.addEventListener('touchstart',function(){
// 			var id=this.getAttribute('data-id');
// 			del.innerHTML="fighting..."
// 			$.ajax('/php/shanchulianxiren.php?id='+id,function(data){
// 				// console.log(data)
// 				del.innerHTML="delete";
// 				// console.log(del);
// 				render();
// 				localStorage.data=JSON.stringify(contacts);
// 				hide();
// 			})

// 	   		$.ajax('/php/huoqulianxiren.php',function(data){
// 				var _d=JSON.parse(data);
// 				if(_d.length!== contacts.length){
// 					contacts=_d;
// 					localStorage.data=JSON.stringify(contacts);
// 				    render();
// 				}
// 			}) 

// 		})


// //update		
// 		contact.addEventListener('touchstart',function(e){
// 			finish.classList.add('gengxin');
// 			del.style.display='block';
			
// 			var el = e.target;                                                 //   e.target
// 			var id = el.getAttribute('aa');
// 			del.setAttribute('data-id',id);
// 			finish.setAttribute('data-id',id);
// 			var tmp=contacts.filter(function(v){                                //保留相等的
// 				return v.id===id;                                  
// 			})
// 			show();
// 			inputName.value = tmp[0].name;
// 			inputPhone.value = tmp[0].phone;
// 			inputBeizhu.value = tmp[0].beizhu;
// 		})


		
	






















// //过滤 为真保留
// // 删除 点开联系人，拿到ID（a），设置value




// //1.获取到所有的联系人 => 数组中
//     // 如果本地有数据&&本地的数据和数据库一致，
//     // 把本地存储的数据【转成数组，获取的是字符串】放到数组中,调用渲染函数(不能放在外边，因为异步问题)
//     // 如果本地没有数据，发送一次AJAX请求，从数据到或取到信息放到数组中 ，调用渲染函数。和上面一样
//     // （提示用户初始化中，请等待，一段时间没有成功之后，若没有成功，换一个提示）


// //2.把数据渲染到页面中
//   //   先把联系人列表和右侧都清空
//   //   然后分析数组中的数据，右侧按照字母从小到大，列出所有联系人的字母
//   //   左侧列表中按照字母分组提示所有的联系人
//   //   县遍历数组，构造字典 {k:[x1,x2]}
//   //   遍历字典，用键取绘制右侧 和 左侧的头部    用值去绘制联系人列表


// //3.展示效果
// 	// 点击右侧，左边切换
// 	// 在右侧滑动，左侧切换
// 	// 左侧滑动时候，分组信息要position：absolute留在顶部，实时更换


// //4.CURD
// // create 点击+号，弹出窗口，编辑电话和姓名
// //        点击完成后，发送一次ajax请求，把信息存储到数据库
// //        然后服务器会返回ID 我们把ID+电话+姓名, 保存到我们的数组中，同时也保存到本地种
// //        重新绘制一次页面
// // delete 在列表向左滑动，出现删除按钮，点击删除
// 		  // 发送ajax请求，把ID发过去，从数组中删掉这个ID的数据
// 		  // 重新绘制一次页面
// //update 点击每一个条目，弹出一个窗口
// 		 // 在窗口中展示电话和姓名以及备注
// 		 // 添加一个编辑按钮，点击唐所有的条目可编辑
// 		 // 点击完成的时候吧数据发给服务器
// 		 // 同时把数组中的数据也换掉
// 		 // 重新绘制页面
// //read   先把所有数据取出来，和页面中的数据匹配
// 		// 如果没有变化，什么都不做
// 		// 如果有变化，页面中的数组换成服务器取回来的那个数组
// 		// 重新绘制页面


































