const puppeteer = require("puppeteer");

const fs = require("fs");
const onda = 2;

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://corporate.fluencyacademy.io/login");
  await new Promise(function (resolve) {
    setTimeout(resolve, 500);
  });

  //await page.waitFor('input[name="username"]');
  await page.type('#member_email', '...'); //inserir e-mail
  await page.type('#member_password', '...'); //inserir senha
  await page.click('#new_member_session > div.button_bottom');

  await new Promise(function (resolve) {
    setTimeout(resolve, 2000);
  });
  //english 2.0
  //await page.click('#section-librarythrees1 > div.background-image.lib3_section1_back.common.back_new > div > div > div.row.acc.center-align > div > div.blocks.block--1590835170093.accessed > a > div.block_size > div.button');
  //english Business
  await page.click(
    "#section-librarythrees1 > div.background-image.lib3_section1_back.common.back_new > div > div > div.row.acc.center-align > div > div.blocks.block--1630525236624.accessed > a > div.block_size > div.button"
  );

  let hasUnits = true,
    countUnit = 1;
  while (hasUnits !== false) {
    try {
      await new Promise(function (resolve) {
        setTimeout(resolve, 2000);
      });
      const wave = onda + 2;
      await page.$$eval(
        `body > div.sticky-footer-wrap > div.content-wrap > div.top_banner.desk_data > div.header_btn_menu > div > div > ul > li:nth-child(${wave}) > ul > li:nth-child(${countUnit}) > a`,
        (elems) => elems[0].click()
      );
      if (onda === 1) fs.appendFileSync("files.txt", `Unit ${countUnit}:\n`);
      else fs.appendFileSync("files.txt", `Unit ${countUnit + 12}:\n`);
      countUnit++;

      let successPage = 0,
        count = 4;
      while (successPage !== 1) {
        try {
          //ja estou na primeria página
          await new Promise(function (resolve) {
            setTimeout(resolve, 2000);
          });
          await page.$$eval(
            `body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.sidebar_cs.desk_data > div.category-listing > div > a:nth-child(${count})`,
            (elems) => elems[0].click()
          );
          count++;

          let hasDocs = 0,
            countArquivo = 1;
          while (hasDocs !== 1) {
            try {

              //arquivo com nome dos arquivos baixados
              await new Promise(function (resolve) {
                setTimeout(resolve, 2000);
              });
              const label = await page.$eval(
                `body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.sidebar_cs.desk_data > div.sidebar > div > div > a:nth-child(${countArquivo}) > span`,
                (element) => {
                  return element.textContent;
                }
              );
              fs.appendFileSync("files.txt", `${label}\n`);

              //download
              await page.click(
                `body > div.sticky-footer-wrap > div.content-wrap > div.post > div.container > div > div.sidebar_cs.desk_data > div.sidebar > div > div > a:nth-child(${countArquivo})`
              );
              countArquivo++;
            } catch (err) {
              hasDocs++;
            }
          }
        } catch (err) {
          successPage++;
        }
      }
    } catch (err) {
      hasUnits = false;
      fs.appendFileSync("files.txt", "Fim!");
    }
  }

  debugger;
  //await browser.close();
})();
