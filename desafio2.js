//En principio mostrare como seria mostrando todo lo que se solicita y 
//luego lo aplico a los productos que use la entrega anterior

const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async addProduct(product) {
        try {
            // Para leer productos existentes del archivo
            const products = await this.getProductsFromFile();

            // Validando campos obligatorios
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error("Todos los campos son obligatorios.");
            }

            // Verificando que el código de producto ya existe
            const codeExists = products.some(existingProduct => existingProduct.code === product.code);
            if (codeExists) {
                throw new Error("El código de producto ya existe.");
            }

            // Asignar ID autoincrementable
            product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

            // Agregar producto al arreglo
            products.push(product);

            // Guardar productos en el archivo
            await this.saveProductsToFile(products);

            return product.id;
        } catch (error) {
            throw new Error('Error adding product: ' + error.message);
        }
    }

    async getProducts() {
        try {
            // Leer productos del archivo
            const products = await this.getProductsFromFile();
            return products;
        } catch (error) {
            throw new Error('Error getting products: ' + error.message);
        }
    }

    async getProductById(id) {
        try {
            // Leer productos del archivo
            const products = await this.getProductsFromFile();

            // Buscar producto por ID
            const product = products.find(product => product.id === id);
            if (!product) {
                throw new Error("Producto no encontrado.");
            }

            return product;
        } catch (error) {
            throw new Error('Error getting product by id: ' + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            // Leer productos del archivo
            const products = await this.getProductsFromFile();

            // Encontrar el índice del producto a actualizar
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                // Actualizar campos del producto
                products[index] = { ...products[index], ...updatedFields };

                // Guardar productos actualizados en el archivo
                await this.saveProductsToFile(products);

                return true;
            } else {
                return false; // Producto no encontrado
            }
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            // Leer productos del archivo
            let products = await this.getProductsFromFile();

            // Filtrar productos, excluyendo el que tiene el ID proporcionado
            products = products.filter(product => product.id !== id);

            // Guardar productos actualizados en el archivo
            await this.saveProductsToFile(products);

            return true;
        } catch (error) {
            throw new Error('Error deleting product: ' + error.message);
        }
    }

    async getProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo no existe, retornar un array vacío
                return [];
            } else {
                throw new Error('Error reading file: ' + error.message);
            }
        }
    }

    async saveProductsToFile(products) {
        try {
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf8');
        } catch (error) {
            throw new Error('Error saving products: ' + error.message);
        }
    }
}

// Ahora lo aplico a mis productos de la primera entrega
const productManager = new ProductManager('productos.json');

(async () => {
    try {
        await productManager.addProduct({
            title: 'Rayban',
            description: 'Gafas de sol de alta calidad',
            price: 150,
            thumbnail: 'rayban.jpg',
            code: 'RB001',
            stock: 50
        });

        await productManager.addProduct({
            title: 'Oakley',
            description: 'Gafas deportivas resistentes',
            price: 120,
            thumbnail: 'oakley.jpg',
            code: 'OK001',
            stock: 30
        });

        await productManager.addProduct({
            title: 'Bulgari',
            description: 'Gafas de diseño elegante',
            price: 200,
            thumbnail: 'bulgari.jpg',
            code: 'BL001',
            stock: 20
        });

        const products = await productManager.getProducts();
        console.log(products);

        const product = await productManager.getProductById(1);
        console.log(product);

        await productManager.updateProduct(1, { price: 170 });

        await productManager.deleteProduct(2);
    } catch (error) {
        console.error(error.message);
    }
})();
