(function(Vue, window, Todo){

	var app = new Vue({
		el:'#app',
		data:{
			currentEdit: null,
			todos:Todo.getAll(),
			routerPath:'',
			filterTodos: []
		},
		methods:{
			addTodo (e) {
				if(e.target.value.trim() === "")  return;

				const todos = this.todos;

				todos.push({
					id: todos[todos.length-1] ? todos[todos.length-1].id+1 : 1,
					title: e.target.value.trim(),
					done:false
				})
				e.target.value = "";
			},

			removeTodo (id){
				//删除单个元素
				const todos = this.todos;
				const removedIndex = todos.findIndex( t => t.id === id);
				removedIndex !== -1 && todos.splice(removedIndex,1)
			},

			toggleAll (e) {
				//全选全不选
				const checked = e.target.checked;
				this.todos.forEach( t => t.done = checked)
			},

			getEditting (todo) {
				//双击元素，修改元素内容
				this.currentEdit = todo;
			},

			editTodo (todo, e) {
				todo.title = e.target.value
				this.cancelEdit()
			},

			cancelEdit () {
				this.currentEdit = null;
			},

			clearAllDone () {

				const todos = this.todos;
				let len = todos.length;

				for(var i = 0; i < len; i++){
					todos[i].done && (todos.splice(i ,1), i--, len--)
				}
			}	
		},

		watch: {
			//监视只能监视data 和 computed 成员
			todos: {
				handler () {
					Todo.seva(this.todos)
					window.onhashchange()
				},
				deep:true// 只有数组 或者对象需要配置深度检测
			}
		},

		computed: {
			remaningCount () {
				return this.todos.filter( t => !t.done).length
			},
			hasDone () {
				return this.todos.some( t => t.done)
			}
		}
	})

	//监视 hashchange 事件
	//hash 改变，难道当前的 hash
	//根据不同的 hssh 过滤显示不同的数据源

	window.onhashchange = function(){
				console.log( app.todos )

		const hash = window.location.hash.substr(1)
		app.routerPath = hash
		switch (hash) {
			case '/active':
				//显示所有 done 为 false的todos
				app.filterTodos = app.todos.filter( t => !t.done)
				break;
			case '/completed' :
				app.filterTodos = app.todos.filter( t => t.done)
				break;
			default:
				app.routerPath = '/'		
				app.filterTodos = app.todos
				break
		}
	}

	window.onhashchange()
})(Vue,  window, Todo)
