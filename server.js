// const express = require('express');
const { json } = require('express');
const express = require('express');
const app = express();
const fs= require('fs');
require("dotenv").config()
const bodyparser = require('body-parser');
const stripe = require("stripe")("private key");

// const ejs = require('ejs');

app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(express.json())
// app.use(bodyparser.urlencoded({ extended: true }))
app.get("/store", function(req, res,){
      fs.readFile("items.json", function(err,data){
            if(err) {
                  res.status(500).end()
            }else{
                  res.render("store.ejs",{items:JSON.parse(data)})
            }
      })
})
app.get("/success", function(req, res) {
      res.send("thank you ")
})

app.post("/payment", async (req, res) => {
      const { product } = req.body;
      console.log(req.body)
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
              {
                  price_data: {
                      currency: "usd",
                      product_data: {
                          name: product.name,
                        //   images: [product.image],
                      },
                      unit_amount: product.amount * 100,
                  },
                  quantity: product.quantity,
              },
          ],
          mode: "payment",
          success_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/store",
      });
  
      res.json({ id: session.id });
  });
app.listen(3000,()=> console.log("app is active"))