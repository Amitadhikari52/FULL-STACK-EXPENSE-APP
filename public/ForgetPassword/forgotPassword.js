async function forget(e){
    try{
        e.preventDefault();
        const email = document.getElementById('email').value;
      
      if(!email){ return alert('Please enter your correct email')}
      const result = await axios.post("http://localhost:3000/password/forgotpassword", {email})
      console.log(result.data)
      //notification(res.data.message);
      document.getElementById('email').value="";
      document.body.innerHTML += `<div style="color:green;">${result.data.message}
      <div>`
      }
      catch(err){
        console.log(err)
        //notification(err);
        document.body.innerHTML += '<div style="color:red;">${err} <div>'
      }
    }
  
  
