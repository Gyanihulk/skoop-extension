import * as cheerio from 'cheerio';

const Scrape = async() => {
    console.log("scrape called")
    await new Promise((resolve, reject) => {
        const maxTime = 10000; // Maximum time to check in milliseconds
        const intervalTime = 500; // Interval time in milliseconds
        let elapsedTime = 0;
    
        const checkInterval = setInterval(() => {
          if (window.location.href.includes('overlay')) {
            clearInterval(checkInterval);
            console.log('Overlay found in URL:', window.location.href);
            resolve('Overlay found');
          }
    
          elapsedTime += intervalTime;
          if (elapsedTime >= maxTime) {
            clearInterval(checkInterval);
            console.log('Overlay not found within the time limit');
            reject(new Error('Overlay not found'));
          }
        }, intervalTime);
    });
    var data=document.getElementsByTagName('body')[0].innerHTML
    var $ = cheerio.load(data)
    var $selected = $('.artdeco-modal__content') 
    try{
        var lkdn=''
        try{
            lkdn=$selected[0].children[1].children[5].children[1].children[5].children[1].attribs.href
        }catch(err){
            console.log("linkedin profile not found")
        }
        var mail='mailto:'
        try{
            mail=$selected[0].children[1].children[5].children[9].children[5].children[1].attribs.href
        }catch(err){
            console.log("email id not found")
        } 
        var email=mail.substr(7)
        var $name=$('.artdeco-modal__header')
        var profname=''
        try{
            profname=$name[0].children[1].children[0].data
        }catch(err){
            console.log("name not found")
        }
        var website='';
        try{
            const linkElements=Array.from(document.getElementsByClassName('pv-contact-info__contact-link'));
            linkElements.forEach((item)=>{
                const str=item.href
                if(!str.includes('@') && !str.includes('linkedin.com/in')){
                    website=item.href;
                }
            })
        }catch(err){
            console.log("website in profile not found")
        }
        console.log("the website", website)
        return [profname.trim(),lkdn,email,website]
    }catch(err){
        console.log("an error occuered" ,err)
        return ["","","",""]
    }
}

export default Scrape