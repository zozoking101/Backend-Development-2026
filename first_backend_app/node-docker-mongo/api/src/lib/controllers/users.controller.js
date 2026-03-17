export const usersPing = (req, res) => {
    res.json({ 
        message: "users pong" 
    })
}

const users = [
  { id: 1234, name: "Alice Smith" },
  { id: 2459, name: "Bob Jones" }
]

export const getUser = (req, res) => {
  const { id } = req.params

  const user = users.find(u => u.id === Number(id))

  if (!user) {
    return res.status(404).json({
      message: `User with id ${id} not found`
    })
  }

  res.json(user)
}

export const createUser = (req, res) => {
  const user = req.body

  res.status(201).json({
    message: `Successfully created new user: ${user.name} 👋🏽`,
    user
  })
}

export const deleteUser = (req, res) => {
  const id = req.params.id

  res.json({
    message: `Successfully deleted user ${id}`
  })
}