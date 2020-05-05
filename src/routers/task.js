const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isAllowedOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isAllowedOperation) 
        return res.status(400).send({ error: "Invalid updates!"})

    try {
        const task = await Task.findById({
            _id: req.params.id, 
            owner: req.user._id
        })
    
        if (!task)
            return res.status(404).send()

        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        
        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createAt_asc
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    const sort = {}
    if (req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if (req.query)
    console.log(req.query)
    try { 
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
})

router.get('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id, 
            owner: req.user._id
        })

        if (!task)
            return res.status(404).send()
        res.send(task)
    } catch (error) {
        res.status(500).send()
        console.log(error)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task)
          return res.status(404).send()  
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router