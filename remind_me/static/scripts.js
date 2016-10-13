var BlogsView = Backbone.View.extend({
                            el: ".mainContainer",
                            signUptemplate: _.template('<div class="container"><div class="card card-container"><p id="profile-name" class="profile-name-card"></p><span id="reauth-email" class="reauth-email"></span><input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus><input type="password" id="inputPassword" class="form-control" placeholder="Password" required><button class="btn btn-lg btn-primary btn-block btn-signin" id="loginId" type="submit">Log in</button><button class="btn btn-lg btn-primary btn-block" id="signUp">Sign up</button></div></div>'),
                            loginTemplate:_.template('<div class="container"><div class="card card-container"><img id="profile-img" class="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" /><p id="profile-name" class="profile-name-card"></p><span id="reauth-email" class="reauth-email"></span><input type="email" id="inputEmail1" class="form-control" placeholder="Email address" required autofocus><input type="password" id="inputPassword1" class="form-control" placeholder="Password" required><input type="password" id="confirmPassword1" class="form-control" placeholder=" Confirm Password" required><button class="btn btn-lg btn-primary btn-block btn-signin" type="submit" id="submitSignup">Sign Up</button></div></div>'),
                            reminderHomepageTemplate:_.template('<div class="row" style="height:100%;margin: 5%"><div class="row" style="height:50px;widht:100%;margin-top: -4%;"><ul class="nav navbar-nav"><li class="dropdown"><a style="line-height: 5px; ! important" href="#" class="dropdown-toggle" data-toggle="dropdown"><%= emailId %><span class="glyphicon glyphicon-user pull-right"></span></a><ul class="dropdown-menu"><li><a  class"menuLinks" id="logout">Logout<span class="glyphicon "></span></a></li></ul></li></ul></div><div class="row" style="height:calc(100% - 100px);widht:100%;margin:0px"><div class="row" style="height:10px"> <h3>Add Reminder</h3></div><div class="row" style="height:5%;margin-top: 5%;margin-left: -3%;"><div class="col-md-6"><input type="text" class="form-control"  id="reminderId" placeholder="Add Reminder Message"/></div><div class="col-md-2"><input type="text"  id="phnId" class="form-control"  placeholder="Phone Number"/></div><div class="col-md-3"><input type="text" class="form-control" id="dateId" placeholder="Date and Time"/></div><div class="col-md-1"><button id="addReminder" class="form-control" >Add</button></div></div><div class="row" style="height:10px;margin-top: 1%;margin-bottom:3%"> <h3>Upcoming Reminders</h3></div><div class="row" style="height:35%;overflow-y: scroll;overflow-x: hidden;" id="upcomingReminder"></div><div class="row" style="height:10px;margin-bottom: 40px;"><h3> Past Reminders</h3></div><div class="row" style="height:35%;overflow-y: scroll;overflow-x: hidden;" id="pastReminder"></div></div></div>'),
                            initialize: function() {
                                var self = this;
                               this.$el.html(self.signUptemplate());
                               this.render();
                                
                            },
                            events:{
                                            'click #signUp':'SignUpFun',
                                            'click #loginId':'loginFun',
                                             'click #logout':'logoutFun',
                                            'click .Edit':'editFun',
                                            'click .Remind':'remindFun',
                                            'click .Save':'saveFun',
                                            'click .Cancel':'cancelFun',
                                            'click .Remove':'removeFun',
                                            'click #addReminder':'addReminderFun',
                                            'click #submitSignup':'submitSignupFun'
                            },
                            SignUpFun:function(){
                                var self=this;
                                    this.$el.html(self.loginTemplate());
                            },
                            remindFun:function(d){
                                var self=this;
                                var currentId=d.currentTarget.id;
                                var rVal=document.getElementById("er1_"+currentId).innerHTML,
                                    pVal=document.getElementById("ep_"+currentId).innerHTML,
                                    dVal=document.getElementById("ed_"+currentId).innerHTML;
                                    alert("Reminder copied to ADD section! Change the date and time of the reminder before adding it again");
                                    self.removeFun(d);
                                    document.getElementById('reminderId').value=rVal;
                                    document.getElementById('phnId').value=pVal;
                                    document.getElementById('dateId').value=dVal;
                            },
                            saveFun:function(d){
                                var self=this;
                                var currentId=d.currentTarget.id,str='';
                                var rVal=document.getElementById("sr_"+currentId).value,
                                        pVal=document.getElementById("sp_"+currentId).value,
                                        date=document.getElementById("sd_"+currentId).value;
                                        for(var i in date){
                                            if(date[i]==" ")  str+='T';
                                            else str+=date[i];
                                         }
                                         str+=':00Z';
                                         console.log(str)
                                var updatedArray={"scheduled_datetime": str,"message": rVal,"phone_number": pVal};
                                 $.ajax({
                                              type: "PUT",
                                              url: "http://localhost:3000/reminders/"+currentId+"/",
                                              data: JSON.stringify(updatedArray),
                                              dataType: 'json',
                                              beforeSend:function(xhr) {
                                                                xhr.setRequestHeader('Authorization', 'Token '+localStorage.Authorization);
                                                            },
                                              success: function(response){
                                                $('#l_'+currentId).html('<div class="row" style="height=10%"> <div class="col-md-10" style="height:100%"><div style="display:inline-block" id="er_'+currentId+'">'+response.message+'</div><div id="ep_'+currentId+'" style="display:none">'+response.phone_number+'</div><span style="background-color:#8f979a;padding:2px;margin-left: 30px;border-radius: 5px;" id="ed_'+currentId+'">'+response.scheduled_datetime+'</span></div> <div class="col-md-1" style="height:100%"><button class="form-control Edit" id="'+currentId+'">Edit</Button></div><div class="col-md-1" style="height:100%"><button class="form-control Remove">Remove</button></div> </div>');
                                                self.getReminders();
                                            },
                                              error:function(err){
                                                alert(err.responseText);
                                              }
                                            });
                                   
                            },
                            cancelFun:function(d){
                                var self=this;
                                self.getReminders();
                            },
                            editFun:function(d){
                                var self=this;
                                    var currentId=d.currentTarget.id;
                                    var rVal=document.getElementById("er_"+currentId).innerHTML,
                                        pVal=document.getElementById("ep_"+currentId).innerHTML,
                                        dVal=document.getElementById("ed_"+currentId).innerHTML;
                                    $('#l_'+currentId).html('<div class="row"><div class="col-md-5" style=""><input type="text" id="sr_'+currentId+'" placeholder="Add Reminder Message" class="form-control" value="'+rVal+'"/></div><div class="col-md-2"><input type="text"  id="sp_'+currentId+'"  placeholder="Phone Number" class="form-control"  value="'+pVal+'"/></div><div class="col-md-3"><input id="sd_'+currentId+'" class="form-control" type="text" placeholder="Date and Time" value="'+dVal+'"/></div><div class="col-md-1" style="height:100%"><button class="form-control Save" id="'+currentId+'" >Save</Button></div><div class="col-md-1" style="height:100%"><button class="form-control Cancel" id="'+currentId+'" >Cancel</button></div></div></div>');
                                    $('#sd_'+currentId).datetimepicker();

                            },
                            removeFun:function(d){
                                var self=this;

                                var currentId=d.currentTarget.id;
                                console.log(currentId);
                                    $.ajax({
                                              type: "DELETE",
                                              url: "http://localhost:3000/reminders/"+currentId+"/",
                                              beforeSend:function(xhr) {
                                                                xhr.setRequestHeader('Authorization', 'Token '+localStorage.Authorization);
                                              },
                                              success: function(response){
                                                self.getReminders();
                                            },
                                              error:function(err){
                                                if(err.responseText) alert(err.responseText);
                                                else alert("Error");
                                              }
                                            });      
                            },
                           addReminderFun:function(){
                                var self=this;
                                    var reminder=document.getElementById('reminderId').value,
                                         phn=document.getElementById('phnId').value,
                                         date=document.getElementById('dateId').value,str='';
                                         for(var i in date){
                                            if(date[i]==" ")  str+='T';
                                            else str+=date[i];
                                         }
                                         str+=':00Z';
                                         console.log(str)
                                         var reminderArray={"scheduled_datetime": str,"message": reminder,"phone_number": phn};
                                            $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/reminders/",
                                              data: reminderArray,
                                              dataType: 'json',
                                              beforeSend:function(xhr) {
                                                                xhr.setRequestHeader('Authorization', 'Token '+localStorage.Authorization);
                                                            },
                                              success: function(response){
                                                console.log(response);
                                                document.getElementById('reminderId').value='',
                                                document.getElementById('phnId').value='',
                                                document.getElementById('dateId').value='';
                                                self.getReminders();
                                              },
                                              error:function(err){
                                                alert(err.responseText);
                                              }
                                            });

                            },
                            logoutFun:function(){
                                localStorage.setItem("Authorization", "");
                                this.$el.html(this.signUptemplate());
                            },
                            loginFun:function(){

                                var self=this;

                                var email=document.getElementById('inputEmail').value,
                                    password=document.getElementById('inputPassword').value,
                                    loginData={"username": email,"password": password};
                                    if(email && password){
                                        $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/rest-auth/login/",
                                              data: loginData,
                                              dataType: 'json',
                                              success: function(response){
                                                localStorage.setItem("Authorization", response.key)
                                                self.$el.html(self.reminderHomepageTemplate({emailId:email}));
                                                    self.getReminders();
                                                     $('#dateId').datetimepicker();
                                              },
                                              error:function(err){
                                                alert("SignUp First!")
                                              }
                                            });

                                    }
                                    else{
                                        alert("Enter Valid Details")
                                    }
                                
                            },
                            getReminders:function(){

                                 $.ajax({
                                                           url: "http://localhost:3000/reminders/",
                                                           type: "GET",
                                                           "Content-Type":'application/json',
                                                           beforeSend:function(xhr) {
                                                                xhr.setRequestHeader('Authorization', 'Token '+localStorage.Authorization);
                                                            },
                                                           headers:{
                                                                'Authorization' : localStorage.Authorization
                                                           },
                                                           success: function(res){
                                                            var time = moment.duration("05:30:00");
                                                             var str='<ul style="margin-top: 35px;height:1%">',arr1=[],arr2=[];
                                                             var d1=new Date();
                                                             d1.setHours(d1.getHours() + 5);
                                                             d1.setMinutes(d1.getMinutes() + 30);
                                                             res.forEach(function(d){
                                                                if((d1.toISOString())<d.scheduled_datetime) arr1.push(d);
                                                                else arr2.push(d);
                                                            })
                                                             arr1.forEach(function(d){
                                                                var date = moment(d.scheduled_datetime);
                                                                date.subtract(time);
                                                                str+='<div style="margin-bottom:20px;height: 20px;" id="l_'+d.id+'"><div class="row" style="height=10%"> <div class="col-md-10" style="height:100%"><div style="display:inline-block" id="er_'+d.id+'">'+d.message+'</div><div id="ep_'+d.id+'" style="display:none">'+d.phone_number+'</div><span style="background-color:#8f979a;padding:2px;margin-left: 30px;border-radius: 5px;" id="ed_'+d.id+'">'+date.format("MMM D h:mmA")+'</span></div> <div class="col-md-1" style="height:100%"><button class="form-control Edit" id="'+d.id+'">Edit</Button></div><div class="col-md-1" style="height:100%"><button id="'+d.id+'" class="form-control Remove">Remove</button></div> </div></div>';
                                                             })
                                                             str+='</ul>';
                                                             $('#upcomingReminder').html(str);
                                                             var str1='<ul style="margin-top: 35px;height:1%">';
                                                             arr2.forEach(function(d){
                                                                var date = moment(d.scheduled_datetime);
                                                                date.subtract(time);
                                                                str1+='<div style="margin-bottom:20px;height: 20px;" id="l_'+d.id+'"><div class="row" style="height=10%"> <div class="col-md-10" style="height:100%"><div style="display:inline-block" id="er_'+d.id+'"><strike id="er1_'+d.id+'">'+d.message+'</strike></div><div id="ep_'+d.id+'" style="display:none">'+d.phone_number+'</div><span style="background-color:#8f979a;padding:2px;margin-left: 30px;border-radius: 5px;" id="ed_'+d.id+'">'+date.format("MMM D h:mmA")+'</span></div> <div class="col-md-1" style="height:100%"><button class="form-control Remind" id="'+d.id+'">Remind</Button></div><div class="col-md-1" style="height:100%"><button id="'+d.id+'" class="form-control Remove">Delete</button></div> </div></div>';
                                                             })
                                                             str+='</ul>';
                                                             $('#pastReminder').html(str1);
                                                           },
                                                           error:function(err){
                                                            //console.log(err);
                                                           }
                                                        });

                            },
                            submitSignupFun:function(){
                                var self=this;
                                var email=document.getElementById('inputEmail1').value,
                                    password=document.getElementById('inputPassword1').value,
                                    confirm_password=document.getElementById('confirmPassword1').value,
                                    signUpData={"email": email,"password": password,"confirm_password": confirm_password};
                                if(password===confirm_password){
                                                $.ajax({
                                              type: "POST",
                                              url: "http://localhost:3000/register/",
                                              data: signUpData,
                                              dataType: 'json',
                                              success: function(response){
                                                localStorage.setItem("Authorization", response.token);
                                                self.$el.html(self.reminderHomepageTemplate({emailId:email}));
                                                $('#dateId').datetimepicker();
                                              },
                                              error:function(err){
                                                alert("SignUp Failed!")
                                              }
                                            });
                                }
                                else
                                {
                                    alert("Password Mismatch!");
                                    self.resetForm();
                                }
                                
                            },
                            resetForm:function(){
                                 document.getElementById('inputPassword1').value='',
                                 document.getElementById('confirmPassword1').value='';
                            },
                            render: function() {
                                var self = this;
                                return this;
                            }
     });

       var blogsView = new BlogsView();