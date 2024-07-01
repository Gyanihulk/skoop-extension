const Scrape = async (commandType) => {
  const executeScrapingFromProfilePage = async () => {
    const name = document.querySelector('a>h1').innerText
    const imgUrl = document.querySelector(`img[alt="${name}"]`).src
    const linkedinUrl = window.location.href
    const desc = document.querySelector('main > section:nth-child(1) > div:nth-child(2) > div:nth-child(2)>div>div:nth-child(2)').innerText
    var address = ''
    try {
      address = document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(3)>span').innerText
    } catch (error1) {
      try {
        address = document.querySelector('main>section>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>span').innerText
      } catch (error2) {}
    }
    return [name, imgUrl, desc, linkedinUrl, address]
  }

  const executeScrapingFromContactInfoOverlay = async () => {
    const waitForElement = (selector, timeout = 3000) => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const element = document.querySelector(selector)
          if (element) {
            clearInterval(interval)
            clearTimeout(timeoutId)
            resolve(element)
          }
        }, 100)

        const timeoutId = setTimeout(() => {
          clearInterval(interval)
          reject(new Error('Element not found within time frame'))
        }, timeout)
      })
    }

    try {
      const anchorTags = document.getElementsByTagName('a')
      let contactLink
      for (let i = 0; i < anchorTags.length; i++) {
        if (anchorTags[i].innerText === 'Contact info') {
          contactLink = anchorTags[i]
          break
        }
      }
      if (contactLink) {
        contactLink.click()
        await waitForElement('.pv-contact-info__contact-type') // Wait for the contact info overlay to load
      } else {
        throw new Error('Contact link not found')
      }

      // Assuming the overlay is now loaded, proceed to scrape the contact information
      var email = ''
      var website = ''
      var twitter = ''
      var phoneNumber = ''
      var linkedinUrl = ''
      var address = ''
      const contactSections = Array.from(document.getElementsByClassName('pv-contact-info__contact-type'))

      contactSections.forEach((item) => {
        const label = item.children[1].innerText
        const value = item.children[2].innerText
        switch (label) {
          case 'Email':
            email = value
            break
          case 'Website':
          case 'Websites':
            website = value.replace(/\n/g, '|')
            break
          case 'Twitter':
            twitter = value
            break
          case 'Phone':
            phoneNumber = value
            break
          case 'Address':
            address = value
            break
          default:
            break
        }
      })

      // Assuming the LinkedIn URL is part of the contact info
      linkedinUrl = window.location.href

      return [email, website, twitter, phoneNumber, linkedinUrl, address]
    } catch (err) {
      console.error('Could not open contact info overlay', err)
      throw err
    }
  }

  const functionToExecute = commandType == 'ContactInfoOverlay' ? executeScrapingFromContactInfoOverlay : executeScrapingFromProfilePage
  const res = await new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const targetTab = tabs[0]
      if (targetTab && targetTab.status === 'complete') {
        try {
          const result = await new Promise((resolve, reject) => {
            chrome.scripting
              .executeScript({
                target: { tabId: targetTab.id },
                func: functionToExecute,
              })
              .then((response) => {
                resolve(response[0].result)
              })
          })
          resolve(result)
        } catch (err) {
          console.error('some error occured in executing script', err)
          resolve(['', '', '', '', '', ''])
        }
      } else {
        resolve(['', '', '', '', '', ''])
      }
    })
  })
  return res
}

export default Scrape
