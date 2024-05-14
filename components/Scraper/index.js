
const Scrape = async(commandType) => {

    const executeScrapingFromProfilePage=async()=>{
        const name=document.querySelector('a>h1').innerText;
        const imgUrl=document.querySelector(`img[alt="${name}"]`).src;
        const linkedinUrl=window.location.href;
        const desc=document.querySelector('main > section:nth-child(1) > div:nth-child(2) > div:nth-child(2)>div>div:nth-child(2)').innerText;
        var address='';
        try{
            address=document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>span').innerText
        }catch(error1){
            try{
            address=document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span').innerText
            }catch(error2){}
        }
        return [name,imgUrl,desc,linkedinUrl,address];
    }

    const executeScrapingFromContactInfoOverlay=()=>{
      try{
        const anchorTags = document.getElementsByTagName('a');
        let contactLink;
        for (let i = 0; i < anchorTags.length; i++) {
          if (anchorTags[i].innerText === 'Contact info') {
            contactLink = anchorTags[i];
            break;
          }
        }
        contactLink.click()
      }catch(err){
        console.error("could not open contact info overlay")
      }
      var email='';
      var website='';
      var twitter='';
      var phoneNumber='';
      var linkedinUrl='';
      const contactSections=Array.from(document.getElementsByClassName('pv-contact-info__contact-type'));
      contactSections.forEach((item,index)=>{
        if(item.children[1].innerText=='Email'){
          email=item.children[2].innerText
        }
        else if(item.children[1].innerText=='Website' || item.children[1].innerText=='Websites'){
          website=(item.children[2].innerText).replace(/\n/g, "|")
        }
        else if(item.children[1].innerText=='Twitter'){
          twitter=item.children[2].innerText
        }
        else if(item.children[1].innerText=='Phone'){
          phoneNumber=item.children[2].innerText
        }
      })
      linkedinUrl="https://www."+contactSections[0].children[2].innerText+"/";
      return [email,website,twitter,phoneNumber,linkedinUrl];
    }

    const functionToExecute = commandType=='ContactInfoOverlay'? executeScrapingFromContactInfoOverlay:executeScrapingFromProfilePage;
    const res=await new Promise((resolve,reject)=>{
        chrome.tabs.query({ active: true, currentWindow: true },async (tabs) => {
            const targetTab=tabs[0];
            if (targetTab && targetTab.status === 'complete') {
              try{
                const result=await new Promise((resolve,reject)=>{
                    chrome.scripting.executeScript({
                        target : {tabId : targetTab.id},
                        func: functionToExecute
                      }).then(response=>{
                          resolve(response[0].result);
                      })
                })
                resolve(result);
              }catch(err){
                console.error("some error occured in executing script",err)
                resolve(["","","","","",""]);
              }
            }
            else{
              resolve(["","","","","",""]);
            }
        });
    })
    return res;
}

export default Scrape