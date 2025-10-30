
"use strict"

document.addEventListener('DOMContentLoaded', ()=>{
    const btnShare = document.querySelector('.btn-share');
    const btnCancel = document.querySelector('.share-container .fa-xmark');
    const shareBox = document.querySelector('.share-container');
    
    btnShare.addEventListener('click',()=>{
        shareBox.classList.toggle('active');
    });
    document.addEventListener('click', (e)=>{
        if(!shareBox.contains(e.target) && !btnShare.contains(e.target)
             || btnCancel.contains(e.target)){
                shareBox.classList.remove('active');
        }
    });
})
