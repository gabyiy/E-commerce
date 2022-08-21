import mongoose from 'mongoose';
//aici creem un model unde salvam produsele pe care useru vrea sa le cumpere cand da click pe place order
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        //iar aici facem o referinta la product model
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResut: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    //si aici salvam useru care a creat requestu
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //iar aici o sa salvam fails adica daca sunt patite sunt trimise etc
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },

  // aici o sa adaugam al doilea parametru la schema
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', orderSchema);

export default Order;
