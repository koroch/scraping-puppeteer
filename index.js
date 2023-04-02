const puppeteer = require('puppeteer');

const fs = require('fs');
const onda = 2;

(async () => {
  const browser = await puppeteer.launch({
      headless: false
  });
  const page = await browser.newPage();
  await page.goto('https://corporate.fluencyacademy.io/login');
  await new Promise(function(resolve) {setTimeout(resolve, 500)});

  //await page.waitFor('input[name="username"]');
  await page.type('#member_email', '...'); //inserir e-mail
  await page.type('#member_password', '...'); //inserir senha
  await page.click('#new_member_session > div.button_bottom');

  await new Promise(function(resolve) {setTimeout(resolve, 2000)});
  //english 2.0
  //await page.click('#section-librarythrees1 > div.background-image.lib3_section1_back.common.back_new > div > div > div.row.acc.center-align > div > div.blocks.block--1590835170093.accessed > a > div.block_size > div.button');
  //english Business
  await page.click('#section-librarythrees1 > div.background-image.lib3_section1_back.common.back_new > div > div > div.row.acc.center-align > div > div.blocks.block--1630525236624.accessed > a > div.block_size > div.button');

  let hasUnits = true, countUnit = 1;
  while(hasUnits !== false){
    try{
      await new Promise(function(resolve) {setTimeout(resolve, 2000)});
      const wave = onda + 2;
      await page.$$eval(`body > div.sticky-footer-wrap > div.content-wrap > div.top_banner.desk_data > div.header_btn_menu > div > div > ul > li:nth-child(${wave}) > ul > li:nth-child(${countUnit}) > a`, (elems) => elems[0].click())
      if(onda===1)
        fs.appendFileSync('videos.txt', `Unit ${countUnit}:\n`);
      else
        fs.appendFileSync('videos.txt', `Unit ${countUnit+12}:\n`);  
      countUnit++;

      //pula a página do cronograma e vai para a primeira que possui vídeo e depois vai alternando para ir pegando os vídeos das outras
      let success = 0, count = 5;
      while(success !== 3){
        try{
          await new Promise(function(resolve) {setTimeout(resolve, 2000)});
          //primeira com vídeo
          await page.$$eval(`body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.sidebar_cs.desk_data > div.category-listing > div > a:nth-child(${count})`, (elems) => elems[0].click())
          count++;
          await new Promise(function(resolve) {setTimeout(resolve, 2000)});
          let data = await page.$eval(`body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.univers > div.desk_data1 > div:nth-child(2) > div.desk_data1 > div > div`, (element) => {
            return element.innerHTML
          })
          let label;
          try{
            await new Promise(function(resolve) {setTimeout(resolve, 2000)});
            label = await page.$eval(`body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.sidebar_cs.desk_data > div.category-listing > div > a.active.link > span`, (element) => {
              return element.textContent
            })
          }catch(err){}
          //salvando o link
          const video = `${data}`.trim().substring(16, 26);
          fs.appendFileSync('videos.txt', `${label}: http://fast.wistia.net/embed/iframe/${video}\n`);
        }catch(err){
          success++;
          if(success===3)
            fs.appendFileSync('videos.txt', '-----------------------------------------\n');
        }
      }
    }catch(err){
      hasUnits=false;
      fs.appendFileSync('videos.txt', 'Fim!');
    }
  }
  
  //debugger;
  await browser.close();
})();