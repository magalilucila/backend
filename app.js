// app.js
const express = require('express');
const fs = require('fs').promises;
const ProductManager = require('./ProductManager');
const app = express();

const manager = new ProductManager('products.json');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    let products = await manager.getProducts();
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = manager.getProductById(productId);
    if (product === "NotFound") {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// Testing de la clase:
manager.getProducts()
  .then(products => {
    console.log(products);
    if (products.length >= 10) {
      console.log('El archivo YA CUENTA CON AL MENOS DIEZ PRODUCTOS CREADOS');
    } else {
      console.log('El archivo NO CUENTA CON AL MENOS DIEZ PRODUCTOS CREADOS');
    }

    return manager.addProduct({
      title: "Nuevo producto",
      description: "Descripción del nuevo producto",
      price: 100,
      thumbnail: "imagen.jpg",
      code: "N001",
      stock: 10
    });
  })
  .then(() => {
    return manager.getProducts();
  })
  .then(productsAfterAdd => {
    console.log(productsAfterAdd);

    return manager.getProductById(2);
  })
  .then(productById => {
    console.log(productById);

    return manager.getProductById(34123123);
  })
  .then(notFoundProduct => {
    console.log(notFoundProduct);
  })
  .catch(error => {
    console.error(error);
  });
