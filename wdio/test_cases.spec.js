describe('Test suite', () => {
    beforeEach(async () => {
        await browser.setWindowSize(1920, 1080);
    });
    it('test case 1', async () => {
        const expectedNumb = 164;

        await browser.url('https://skillbox.ru/');
        const professionBlock = $('//a[@href = "/courses/?type=profession"] // span');
        await professionBlock.scrollIntoView();
        const text = await professionBlock.getText();
        expect(text).toContain(expectedNumb.toString());

        await professionBlock.waitForClickable();
        professionBlock.click();
        const puppeteer = await browser.getPuppeteer();
        const page = (await puppeteer.pages())[0];

        await page.waitForResponse(async (resp) => {
            const url = await resp.url();
            const body = await resp.json();
            return url === 'https://skillbox.ru/api/v6/ru/sales/skillbox/directions/all/nomenclature/profession/?page=1&limit=10&type=profession'
            && body.meta.total === expectedNumb;
        });

        const buttonProf = await $('section.courses-block button.ui-load-more').getText();

        expect(buttonProf).toContain((expectedNumb - 10).toString());
    });

    it('test case 2', async () => {
        const expectedNumb = 164;
        const expectedArticles = 20;

        await browser.url('https://skillbox.ru/');
        const professionBlock = $('//a[@href = "/courses/?type=profession"] // span');
        await professionBlock.scrollIntoView();
        const text = await professionBlock.getText();

        await professionBlock.waitForClickable();
        professionBlock.click();

        let buttonProf = await $('section.courses-block button.ui-load-more');
        buttonProf.click();

        const puppeteer = await browser.getPuppeteer();
        const page = (await puppeteer.pages())[0];
        await page.waitForRequest(
            async (req) => {
                const url = await req.url();
                return url.includes('https://skillbox.ru/api/v6/ru/sales/skillbox/directions/all/nomenclature/profession/?page=2&type=profession');
            },
        );

        await browser.waitUntil(async () => {
            buttonProf = await $('section.courses-block button.ui-load-more');
            return (await buttonProf.getText()).includes((expectedNumb - expectedArticles).toString());
        });
        buttonProf = await $('section.courses-block button.ui-load-more');
        const buttontext = await buttonProf.getText();
        expect(buttontext).toContain((expectedNumb - 20).toString());

        const articles = await $$('div.card-list article');
        expect(articles.length).toEqual(expectedArticles);
    });
});
