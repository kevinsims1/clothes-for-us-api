const jwt =  require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  signIn: function(model) {
    return async function(req, res) {
      try{
        const { email, password } = req.body
        const user = await model.findOne({ email }).lean().exec()
        
        if(!user){
          throw new Error('incorrect email')
        }
        
        bcrypt.compare(password, user.password, function(err, result){
          if(result === true){
            const payload = { id: user._id, role: `${model.collection.collectionName}` }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' })
  
            res.status(200).json({ user, token })
          }
          throw new Error(err)
          
        })
      }catch(err){
        res.status(400).json({message: err})
      }
    }
  }
}
