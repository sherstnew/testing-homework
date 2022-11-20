const { assert } = require("chai");

let bug_id = 0

if (process.env.BUG_ID != undefined) {
    bug_id = process.env.BUG_ID
}

describe('Тесты', async function() {
    it('Существование страниц', async function () {
        await this.browser.url('http://localhost:3000/hw/store?bug_id=' + bug_id);
        isExist = await (await this.browser.$('.Application')).isExisting();
        assert.equal(isExist, true, 'Нет главной страницы');
        await this.browser.assertView('home', '.Application');

        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        isExist = await (await this.browser.$('.Application')).isExisting();
        assert.equal(isExist, true, 'Нет страницы каталога');

        await this.browser.url('http://localhost:3000/hw/store/delivery?bug_id=' + bug_id);
        isExist = await (await this.browser.$('.Application')).isExisting();
        assert.equal(isExist, true, 'Нет страницы доставки');
        await this.browser.assertView('delivery', '.Application');

        await this.browser.url('http://localhost:3000/hw/store/contacts?bug_id=' + bug_id);
        isExist = await (await this.browser.$('.Application')).isExisting();
        assert.equal(isExist, true, 'Нет страницы контактов');
        await this.browser.assertView('contacts', '.Application');
    });
    it('Отображение инфы о товаре', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        assert.equal(await this.browser.$$('.ProductItem-Name')[0].isDisplayed(), true);
        assert.equal(await this.browser.$$('.ProductItem-Price')[0].isDisplayed(), true);
        assert.equal(await this.browser.$$('.ProductItem-DetailsLink')[0].isDisplayed(), true);
    });
    it('Размер кнопки', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog/0?bug_id=' + bug_id);
        await this.browser.assertView('catalogpage', '.Application', {
            ignoreElements: [
                '.ProductDetails-Name',
                '.ProductDetails-Description',
                '.ProductDetails-Color',
                '.ProductDetails-Price',
                '.ProductDetails-Material',
            ],
            compositeImage: true,
        });
    });
    it('Отображение в карточке продукта', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog/0?bug_id=' + bug_id);
        assert.equal(await this.browser.$('.ProductDetails-Name').isDisplayed(), true);
        assert.equal(await this.browser.$('.ProductDetails-Description').isDisplayed(), true);
        assert.equal(await this.browser.$('.ProductDetails-Price').isDisplayed(), true);
        assert.equal(await this.browser.$('.ProductDetails-Color').isDisplayed(), true);
        assert.equal(await this.browser.$('.ProductDetails-Material').isDisplayed(), true);
        assert.equal(await this.browser.$('.ProductDetails-AddToCart').isDisplayed(), true);
    });
    it('Меню отображается', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        assert.equal(await this.browser.$$('.nav-link')[0].isDisplayed(), true);
        assert.equal(await this.browser.$$('.nav-link')[1].isDisplayed(), true);
        assert.equal(await this.browser.$$('.nav-link')[2].isDisplayed(), true);
        assert.equal(await this.browser.$$('.nav-link')[3].isDisplayed(), true);
        assert.equal(await this.browser.$('.navbar-brand').isDisplayed(), true);
    });
    it('Меню-гамбургер', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        await this.browser.setWindowSize(570, 1000);
        assert.equal(await this.browser.$('.Application-Toggler').isDisplayed(), true);
        await this.browser.$('.Application-Toggler').click();
        assert.equal(await this.browser.$('.Application-Menu').isDisplayed(), true);
        await this.browser.$$('.nav-link')[0].click();
        assert.equal(await this.browser.$('.Application-Menu').isDisplayed(), false);
        await this.browser.setWindowSize(784, 1000);
    });
    it('Ссылка на главную страницу', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        assert.equal(await (await this.browser.$('.Application-Brand')).getAttribute('href'), '/hw/store/');
    });
    it('Отображение Item in Cart', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog/1?bug_id=' + bug_id);
        await this.browser.$('.ProductDetails-AddToCart').click();
        assert.equal(await this.browser.$('.CartBadge').isDisplayed(), true);
        await this.browser.url('http://localhost:3000/hw/store/catalog?bug_id=' + bug_id);
        assert.equal(await this.browser.$('.CartBadge').isDisplayed(), true);
    });
    it('Сохранение корзины после перезагрузки', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog/2?bug_id=' + bug_id);
        await this.browser.$('.ProductDetails-AddToCart').click();
        await this.browser.url('http://localhost:3000/hw/store/cart?bug_id=' + bug_id);
        let cartText = await (await this.browser.$('.Application')).getText();
        await this.browser.refresh();
        let cartTextNew = await (await this.browser.$('.Application')).getText();
        assert.equal(cartText, cartTextNew, 'Корзина не сохраняется');
    });
    it('Отображается количество продуктов около ссылки на корзину', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog/2?bug_id=' + bug_id);
        await this.browser.$('.ProductDetails-AddToCart').click();
        await this.browser.url('http://localhost:3000/hw/store/cart?bug_id=' + bug_id);
        assert.equal(await this.browser.$$('.nav-link')[3].getText(), 'Cart (2)', 'Количество продуктов не отображается');
    });
    it('Отображение товара в корзине', async function () {
        await this.browser.url('http://localhost:3000/hw/store/cart?bug_id=' + bug_id);
        assert.equal(await this.browser.$('.Cart-Index').isDisplayed(), true);
        assert.equal(await this.browser.$('.Cart-Name').isDisplayed(), true);
        assert.equal(await this.browser.$('.Cart-Price').isDisplayed(), true);
        assert.equal(await this.browser.$('.Cart-Count').isDisplayed(), true);
        assert.equal(await this.browser.$('.Cart-Total').isDisplayed(), true);
        assert.equal(await this.browser.$('.Cart-OrderPrice').isDisplayed(), true);
    });
    it('Удаление товаров из корзины', async function() {
        await this.browser.url('http://localhost:3000/hw/store/catalog/2?bug_id=' + bug_id);
        await this.browser.$('.ProductDetails-AddToCart').click();
        await this.browser.url('http://localhost:3000/hw/store/cart?bug_id=' + bug_id);
        await (await this.browser.$('.Cart-Clear')).click();
        assert.equal(await (await this.browser.$('.Cart')).getText(), 'Shopping cart\nCart is empty. Please select products in the catalog.', 'Корзина не очищается');
        assert.equal(await (await this.browser.$('.col a')).getAttribute('href'), '/hw/store/catalog', 'Ссылка на каталог не отображается');
    });
});