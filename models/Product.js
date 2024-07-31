const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Ingrese el nombre del producto'],
        maxlength: [100, 'El nombre no puede tener mas de 100 caracteres'],
      },
      price: {
        type: Number,
        required: [true, 'Ingrese el precio del producto'],
        default: 0,
      },
      description: {
        type: String,
        required: [true, 'Ingresar descripcion del producto'],
        maxlength: [1000, 'La descripcion no puede tener mas de 1000 caracteres'],
      },
      image: {
        type: String,
        default: '/uploads/example.jpeg',
      },
      category: {
        type: String,
        required: [true, 'Ingresar categoria'],
        enum: ['perfiles', 'laminas', 'barras'],
      },
      material: {
        type: String,
        required: [true, 'Ingresar material'],
        enum: {
          values: ['aluminio', 'PVC', ],
          message: '{VALUE} no disponible',
        },
      },
      colors: {
        type: [String],
        default: ['#222'],
        required: true,
      },
      featured: {
        type: Boolean,
        default: false,
      },
      freeShipping: {
        type: Boolean,
        default: false,
      },
      inventory: {
        type: Number,
        required: true,
        default: 15,
      },
      averageRating: {
        type: Number,
        default: 0,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
},{ timestamps : true,toJSON:{virtuals:true},toObject:{virtuals:true} })

ProductSchema.virtual('reviews',{
  ref:'Review',
  localField:'_id',
  foreignField:'product',
  justOne:false,
})

ProductSchema.pre('remove', async function (next){
  await this.model('Review').deleteMany({product:this._id})
})


module.exports = mongoose.model('Product',ProductSchema)