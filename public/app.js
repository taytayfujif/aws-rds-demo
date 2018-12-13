const postName = document.querySelector('#post-name');
const postGrade = document.querySelector('#post-grade');
const postSubmit = document.querySelector('#post-submit');
const putName = document.querySelector('#put-name')
const putGrade = document.querySelector('#put-grade')
const putId = document.querySelector('#put-id')
const putSubmit = document.querySelector('#put-submit')
const deleteId = document.querySelector('#delete-id')
const deleteSubmit = document.querySelector('#delete-submit')



postSubmit.addEventListener('click',(event) => {
event.preventDefault();
console.log('name.value', postName.value);
console.log('grade.value', postGrade.value);
axios 
    .post('https://fn01dfbm9h.execute-api.us-west-2.amazonaws.com/dev/post', {
        name: postName.value,
        grade: postGrade.value
    })
  .then(response =>{
    console.log('response', response);
  })
  .catch(e => {
    console.log('error', e)
  })
 })

 putSubmit.addEventListener('click',(event)=>{
  event.preventDefault(); 
   console.log('putName.value', putName.value);
   console.log('putGrade.value', putGrade.value);
   console.log('putId.value', putId.value);
   axios 
   .put('https://fn01dfbm9h.execute-api.us-west-2.amazonaws.com/dev/put', {
       name: putName.value,
       grade: putGrade.value,
       id:putId.value
   })
 .then(response =>{
   console.log('response', response);
 })
 .catch(e => {
   console.log('error', e)
 })
})

deleteSubmit.addEventListener('click',(event)=>{
  event.preventDefault(); 
   
   axios 
   .delete('https://fn01dfbm9h.execute-api.us-west-2.amazonaws.com/dev/delete', {
       data: {
        id:deleteId.value
       }
   })
 .then(response =>{
   console.log('response', response);
 })
 .catch(e => {
   console.log('error', e)
 })
})