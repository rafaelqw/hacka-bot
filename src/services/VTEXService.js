import axios from 'axios';

class VTEXService {
    async start(){
        this.vtexApiURL = axios.create({
            baseURL: 'http://cosmetics2.myvtex.com/api',
            timeout: 30000,
            headers: {
                'VtexIdclientAutCookie': process.env.VTEX_TOKEN
            }
        });
    }

    async searchCategoriesByProduct(productName){
        const response = await this.vtexApiURL.get(`/catalog_system/pub/products/search/${productName}`);
        
        if(response.data){
            let categories = [];
            response.data.map(item => {
                const categorieArr = item.categories[0].split('/');
                const categorie = categorieArr[categorieArr.length - 2];
                categories.push(categorie);
            });

            categories = categories.filter((item, index, self) => {
                return index === self.indexOf(item);
            });

            return categories;
        }

        return false;
    }

    async searchItemsByProduct(productName){
        const response = await this.vtexApiURL.get(`/catalog_system/pub/products/search/${productName}`);
        
        if(response.data.length > 0){
            let items = [];
            response.data.map(item => {
                item.items.map(x => {
                    items.push({sku: x.itemId, name: x.nameComplete})
                });
            });

            return items;
        }

        return false;
    }
}

export default new VTEXService();