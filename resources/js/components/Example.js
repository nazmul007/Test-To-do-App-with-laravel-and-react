import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
import { Table,Button,Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, } from 'reactstrap';

class Example extends Component  {
    constructor(props) {
        super(props)
        this.state = {
            tasks: [],
            newTaskModal:false,
            editTaskModal:false,
            newAddTask:{
                name : "",
                description : ""
            },
            editTaskData:{
                id:"",
                name:"",
                description:""
            }
        
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdateChange = this.handleUpdateChange.bind(this)
    }

    loadTask() {
        axios.get('http://localhost/test-laravel/public/api/tasks').then( (response) => {
            this.setState({
                tasks:response.data
            })
          })
    }
    addNewTask() {
        axios.post('http://localhost/test-laravel/public/api/task',this.state.newAddTask).then( (response) => {
            let {tasks} = this.state
            this.loadTask();
            this.setState({
                tasks,
                newTaskModal:false,
                newAddTask:{
                    name : "",
                    description : ""
                }
            })
          })
    }

    editTask(id,name,description) {
      
            this.setState({
               
                editTaskModal:!this.state.editTaskModal,
                editTaskData:{
                    id,
                    name,
                    description
                }
           
          })
    }
    updateTask() {
      let{name,description} = this.state.editTaskData
      axios.put('http://localhost/test-laravel/public/api/task/'+this.state.editTaskData.id,{
          name,description
      }).then( (response) => {
            this.loadTask();
            this.setState({
                editTaskModal:!this.state.editTaskModal,
                editTaskData:{
                    name : "",
                    description : ""
                }
            })
          })
    }
    deleteTask(id) {
        axios.delete('http://localhost/test-laravel/public/api/task/'+id).then( (response) => {
            this.loadTask();
        })
      }
    handleInputChange(event) {
        const { newAddTask } = { ...this.state };
        const currentState = newAddTask;
        const { name, value } = event.target;
        currentState[name] = value;
        this.setState({ newAddTask: currentState });
    }
    handleUpdateChange(event) {

        const { editTaskData } = { ...this.state };
        const updatetState = editTaskData;
        const { name, value } = event.target;
        updatetState[name] = value;
      
        this.setState({ editTaskData: updatetState });
    }
    componentWillMount() {
        this.loadTask();
    }
    toggleNewTaskModal() {
        this.setState({
            newTaskModal:!this.state.newTaskModal
        })
    }
    toggleEditTaskModal() {
       
        this.setState({
            editTaskModal:!this.state.editTaskModal,
        })
    }
    
    render() {

        let tasks = this.state.tasks.map( task =>{
            return(
                <tr key = {task.id}>
                    <th scope="row">{task.id}</th>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>
                        <Button color="primary" size="sm" className="mr-2" onClick={this.editTask.bind(this,task.id,task.name,task.description)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteTask.bind(this,task.id)}>Delete</Button>
                    </td>
                </tr>

            )
        }

        )
        return (
            <div className="container">
                <div>
                    <Button color="danger" onClick={this.toggleNewTaskModal.bind(this)}>Add Task</Button>
                    <Modal isOpen={this.state.newTaskModal} toggle={this.toggleNewTaskModal.bind(this)} >
                        <ModalHeader toggle={this.toggleNewTaskModal.bind(this)}>Add task</ModalHeader>
                        <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input  id="name" name="name" value ={this.state.newAddTask.name} onChange={this.handleInputChange} placeholder="with a placeholder" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input  id="description"  name="description" onChange={this.handleInputChange} value={this.state.newAddTask.description} placeholder="with a placeholder" />
                        </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={this.addNewTask.bind(this)}>Add task</Button>
                        <Button color="secondary" onClick={this.toggleNewTaskModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.editTaskModal} toggle={this.toggleEditTaskModal.bind(this)} >
                        <ModalHeader toggle={this.toggleEditTaskModal.bind(this)}>Edit Task</ModalHeader>
                        <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input  id="name" name="name" value ={this.state.editTaskData.name} onChange={this.handleUpdateChange} placeholder="with a placeholder" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input  id="description"  name="description" onChange={this.handleUpdateChange} value={this.state.editTaskData.description} placeholder="with a placeholder" />
                        </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={this.updateTask.bind(this)}>Update  task</Button>
                        <Button color="secondary" onClick={this.toggleEditTaskModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    
                {tasks}
                </tbody>
            </Table>
        </div>
        )
    };
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
