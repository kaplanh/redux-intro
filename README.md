# How to use Redux with React?

<img src="./redux.gif" alt="reduxGif">

1-redux i asagidaki kodlarla projemize ekliyoruz
yarn add redux react-redux or npm install redux react-redux or pnpm install redux react-redux 
2-src icinde store adinda bir klasör aciyoruz
3-bu klasör icinde store.jsx yada index.jsx diye bir dosya aciyoruz burda birden fazla dosya olabilir counterReducer.js todoReducer.js gibi 

NOT: her klasörün icinde index.jsx adinda bir dosya olabilir bu su anlamia gelir:bu klasörün babasi veya annesi bu dosyadir ve bu klasör icindeki yapilmasi gerekenlerin  dosya birlestirme islemlerini bu dosyada yapabiliyoruz
Store icindeki birden fazla dosya varsa bunlar index.js icinde birlestirilir ve sadece index in import edilmesi yeterli olacaktir

Diger bir nokta ise stordan index disinda her hangi bir dosyayi  import ederken 
Import counter from "./store/counterReducer.jsx"  seklinde yazmamiz gerekirken
Index default olarak algilandigindan
Import store from "./store" 
Seklinde yazarak  stordan hangi dosyayi getirilmesi yazilmazsa index.jsx getirilir


Not-1:
Import ederken normalde import store from "./store/index" seklinde olmasi gerekirken  import store from ".'/store" yazmamizda yeterli olur cünkü
react index ismini bulunduğu lokasyonda default olarak  varsayıyor ve belirtmezsek index i cagiriyor


Not-2:bir componentte sadece bir export varsa ve default olarak export edilmisse bu durumdada klasörün ismini yazip dosyanin ismini yazmasakta yine o dosya export edilecektir

Not-3:
Büyük harfle başlayan dosya adları genellikle React bileşenlerini ifade eder 
Ama  küçük harfle başlayan dosya adları genellikle normal JavaScript modülleri veya yardımcı işlevler gibi diğer kod dosyalarını ifade eder.

4-counterReducer.js icinde initialState objesinin icinde state lerin baslangic durumlarini olusturuyoruz

```jsx
const initialState = {
  count: 0,
}
```


Veya

```jsx
const initialState = {
  todoList: [{ id: new Date().getTime(), text: "work redux", completed: true }],
}
```



5-pure function olan reducer fonksiyonumuzu switch-case yapisinda  yaziyoruz


```jsx
export const counterReducer = (state = initialState, action) => {//bu counterReducer fonksiyonu state ve action adinda obje olan iki parametre alir
State initialState den gelir action ise dispatch icindeki action ={type:'',payload:''}dan gelir.
```


***burdaki INC,DEC,CLR type larini state lerin degisecegi noktalari belirlerken biz belirliyoruz

Bu fonksiyon pure fonk oldugu icin gelenlere bakar ve bir state objes döndürür o nedenle her bir case altina break yerine return yazmaliyiz obje olacagindan dolayida {} kullanmaliyiz return olunca zaten döndürüp cikacagi icin break e gerek kalmadi o nedenle siliyoruz
  

  ```jsx
  switch (action.type) {
    case "INC": //? count:  state.count + 1
      return { count: state.count + 1 }
    case "DEC":
      return { count: state.count - 1 }
    case "CLR":
      return { count: 0 }
    default:
      return state
    //! Reducer fonksiyonu muhakkak bir state objesi dondurmelidir. Yanlis bir type gelse bile state'in ilk halini dondurmelidir.
  }
}

```
  
  

6-store icindeki index.jsx  icinde store'u olusturuyoruz
createStore() 'u redux dan import ediyoruz icine parametre olarak olusturdugumuz counterReducer i verip  ve store'umuzu olusturuyoruz

```jsx
import {createStore} from "redux"

```
createStore kaldirilacagindan dolayi üstü cizili geliyor artik redux-tools u kullanin diyor
Bu görüntüden kurtulmanin yolu  


```jsx
import { legacy_createStore as createStore, combineReducers } from "redux" bu sekilde yazmak
export const store = createStore(counterReducer)

```


7-olusturdugumuz store u store ve react-redux dan Provider i  App.jsx de import ediyoruz sonra Provider ile componentleri sarmalliyoruz store da props olarak heybesine koyuyoruz



```jsx

//App.jsx
// import { store } from "./store/index"
import { store } from "./store"  // index yazmayinca default olarak aliyor iki sekildede yazabiliriz best practice bu sekilde
import { Provider } from "react-redux"


function App() {
  return (
    <div className="app">
      <Provider store={store}> //artik bu Provider ile sarmallanan tüm componentler bu statelere ulasabilirler ama okumak icin componentler icinde useSelector() hook u ile okuyoruz
        <Counter />
        <Todo />
      </Provider>
    </div>
  )
}
export default App

```

8-state lere ulasmak istedigimiz component'e gidip `useSelector()` hook'unu import edip icine colback fonk ile baslangic state lere ulasiyoruz


//Counter.jsx
 ```jsx
 const count = useSelector((state) => state.count)
 ```
9-state degisim istekleri icin bir event yazip bu eventle birlikte dispatch olusturmaliyiz
Bunun icin `useDispatch()` i react-redux import ediyoruz ve onu dispatch degiskenine atiyoruz 

```jsx
//Counter.jsx
import { useSelector, useDispatch } from "react-redux"
const dispatch = useDispatch()

 <button
          className="counter-button positive"
          // onClick={() => dispatch({ type: INC })}
          onClick={() => dispatch(increment())}
        >
          increase
        </button>

```


***Bestpractice lik icin 1.not***
Zorunluluk olmamkla beraber string hatalarindan kurtulmak icin stringler bir degiskene atanir ve diger yerlerde bu degiskenlerle cagrilir buna constet denir

***Hatalari azaltmak icin string leri degiskene atayarak ve named export olarak yazmak bestpractice buna type declaration deniyor

 //Pure Function (reducer)--counterReducer.js

//? counter type declarations
//* string'ler hataya meyillidir.Bu hatalari minimize etmek icin string type'lari degiskenlere saklanir ve degisken olarak kullanilabilir.


```jsx
export const INC = "INC"
export const DEC = "DEC"
export const CLR = "CLR"
```

1-counterReducer.js icinde Swit-case yapisinda string yerine artik bu degisken hali kullanilir 


```jsx
// Pure Function (reducer)--counterReducer.js
export const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INC: //? count:  state.count + 1
      return { count: state.count + 1 }
    case DEC:
      return { count: state.count - 1 }
    case CLR:
      return { count: 0 }
    default:
      return state
    //! Reducer fonksiyonu muhakkak bir state objesi dondurmelidir. Yanlis bir type gelse bile state'in ilk halini dondurmelidir.
  }
}

```
2-Counter.jsx icindede bu degiskenler import edilir ve type larda strin yerine bu degiskenler kullanilir

```jsx
//Counter.jsx

import { useSelector, useDispatch } from "react-redux"
import "./Counter.css"
import {CLR, DEC, INC} from "../../store/counterReducer"
const Counter = () => {
  //? Global state'in tüketilmesi
 
  //? Rootreducer sonrasi consuming
  const count = useSelector((state) => state.count)//state in baslangic degerini buraya aldik  


  const dispatch = useDispatch()
  return (
    <div className="app">
      <h2 className="counter-header">Counter With Redux</h2>
      <h1>counter:{count}</h1>
      <div>
        <button
          className="counter-button positive"
          onClick={() => dispatch({ type: INC })}
       
        >
          increase
        </button>
        <button
          className="counter-button zero"
          onClick={() => dispatch({ type: CLR })}
          
        >
          reset
        </button>
        <button
          className="counter-button negative"
          onClick={() => dispatch({ type: DEC })}
          
        >
          decrease
        </button>
      </div>
    </div>
  )
}
export default Counter
```

***Bestpractice lik icin 2.not***
    Ayni dispatch i birden fazla yerde yazmak durumunda kaldigimizda her defasinda dispatch({type:INC,payload:"…"}) seklinde action fonksiyonlari ile ugrasmamak icin bu action type larini belirten fonksiyonlar counterReducer.js icinde named export ile  yazilir ve Counter.jsx de dispatch ile state degisim istegi göndermek istedigimiz her yerde dispatch icinde bu action type fonk nunu kullanabiliriz
    // counterReducer.js
    //? counter type declarations
    export const INC = "INC"
    export const DEC = "DEC"
    export const CLR = "CLR"
    //! action islemlerini basitlestirmek icin action type fonksiyonlari 
    export const increment = () => {
    return { type: INC }
    }
    export const decrement = () => ({ type: DEC }) //single staytment oldugundan süslü kullanmayabiliriz bu nedenle return da kullanmaya gerek yok sadece () acip ifadeyi direk icine yaziyoruz yukaridaki ile bu ayni sey
    export const clear = () => ({ type: CLR })
```jsx
    //Counter.jsx 
    import { useSelector, useDispatch } from "react-redux"
    import "./Counter.css"
    import {
      clear,
      decrement,
      increment,
    } from "../../store/counterReducer"
    const Counter = () => {
      //? Global state'in tüketilmesi
      //? Rootreducer sonrasi consuming
       const {count} = useSelector((state) => state.counter)
      //? useDispatch custom redux hookudur
      const dispatch = useDispatch()
      return (
        <div className="app">
          <h2 className="counter-header">Counter With Redux</h2>
          <h1>counter:{count}</h1>
          <div>
            <button
              className="counter-button positive"
              // onClick={() => dispatch({ type: INC })}
              onClick={() => dispatch(increment())}
            >
              increase
            </button>
            <button
              className="counter-button zero"
            // onClick={() => dispatch({ type: CLR })}
              onClick={() => dispatch(clear())}
            >
              reset
            </button>
            <button
              className="counter-button negative"
              // onClick={() => dispatch({ type: DEC })}
              onClick={() => dispatch(decrement())}
            >
              decrease
            </button>
          </div>
        </div>
      )
    }
    export default Counter
    ```
    
    Not:store klasörü altinda counterTyps.js diye dosya acip type lari orada
    
    counterActions.js  dosyasindaAction create fonksiyonlarini 
    counterReducer.js icindede switch-case yapisinda reducer fonksiyonlarini ayri ayrida görebiliriz
  
## Note
    Vs code rxreducer kisayoluna basinca reducer fonk yapisini cikariyor

## redux-devtools-extension
[redux-devtools-extension](https://www.npmjs.com/package/redux-devtools-extension)

```jsx
//src/store/index.jsx
import { legacy_createStore as createStore, combineReducers } from "redux";
import { counterReducer } from "./counterReducer";
import { todoReducer } from "./todoReducer";

//? reduc dev tool için eklendi
// https://www.npmjs.com/package/redux-devtools-extension
import { composeWithDevTools } from "@redux-devtools/extension";

//! store 'u olustrduk
// export const store = createStore(counterReducer)

const rootReducer = combineReducers({
    counter: counterReducer,
    todo: todoReducer,
});

// export const store = createStore(rootReducer, composeWithDevTools())

//? Eger development asamasinda ise devtool aktif olsun aksi takdirde (prod,test vb) aktif olmasin
export const store = createStore(
    rootReducer,
    process.env.NODE_ENV === "development" && composeWithDevTools()
);

// process.env.NODE_ENV === "test"
// process.env.NODE_ENV === "production"

```

## deploy
- derleme icin
`pnpm build`

- canlidaki halini görmek icin
`pnpm preview`
