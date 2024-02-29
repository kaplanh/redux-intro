//? todoReducer type declaration
//rxconst ==>export const first = 'first'

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const CLEAR_TODO = "CLEAR_TODO";

//? action function declartion
// rxaction ==>
// export const first = (payload) => ({
//   type: second,
//   payload
// })

export const addTodo = (payload) => ({ type: ADD_TODO, payload });
export const clearTodo = () => ({ type: CLEAR_TODO });
export const delTodo = (payload) => ({ type: DELETE_TODO, payload });
export const toggleTodo = (payload) => ({ type: TOGGLE_TODO, payload });



// rxreducer==>
// const initialState = {}

// export default (state = initialState, { type, payload }) => { //export dan sonra todoReducer gibi isim vermeliyiz
//   switch (type) {

//   case first:
//     return { ...state, ...payload }

//   default:
//     return state
//   }
// }

//? baslangic durumlari
const initialState = {
    todoList: [
        { id: new Date().getTime(), text: "work redux", completed: true },
    ],
};

export const todoReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ADD_TODO:
            return {
                todoList: [
                    ...state.todoList,
                    {
                        id: new Date().getTime(),
                        text: payload,
                        completed: false,
                    },
                ],
            };

        case CLEAR_TODO://clear butonu icin
            return initialState;

        //TODO
        case DELETE_TODO://x butonu icin
            return {
                todoList: state.todoList.filter((item) => item.id !== payload),
            };

        //TODO
        case TOGGLE_TODO: {
            return {
                todoList: state.todoList.map((item) => {
                    return item.id === payload
                        ? { ...item, completed: !item.completed }
                        : item;
                }),
            };
        }

        default:
            return state;
    }
};
