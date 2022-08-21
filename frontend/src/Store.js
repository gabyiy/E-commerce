import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  //aici facem o verificare in broser sotrege daca avem useru

  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  //creem cart si cartitems o sa fie un array gol pentru ca la inceput nu o sa avem nimic in el
  cart: {
    //si aici salvam in local storage datrele de la shippingAddress
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
//facem acelasi lucru salvam paymentMethod ,nu folosim json.parse pentru ca este un string
 paymentMethod:localStorage.getItem("paymentMethod")?
localStorage.getItem("paymentMethod"):
 "",

    //iar aici spunem daca avem in localstorege salvat cartItems sa il transforme cu parser si sa il salveze in cartItems altfel sa ne arate un array empty ca dorim sa vina din memoria webului

    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

//lafel ca reduceru unde aducem informatie din back
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //aici salvam noile itemuri care lla adaugam la cariucionr
      const newItem = action.payload;
      //apoi vedem itemele deja existente
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      //iar acum vedem daca avem deja acest item in cart facem un map pentru a updata  itemu curent cu nou item care il primim de action.payload altfe lsa mentina itemu anterior in cart, altfel sa il adauge la finalu cartului
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      //iar dupa sa updateze state cu cartItems si le salvam in memorie ca sa nu dispara cand dam refres
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    //aici facem un remove la itemele din cart dar doar la acelea de acelasi tip
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }
    //iar aici golim tot ce avem in interior la cart
    case "CART_CLEAR":{
      return{...state,cart :{...state.cart,cartItems:[]}}
    }
    //in caz ca trimitem un dispach catre usersigin salvam in userInfo ce primim de la dipach
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    //creem signout,tinand statu anterior si setand userInfo la null iar dupa golim si cart si shippingAddress
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart:{
          cartItems:[],
          shippingAddress:{},
          paymentMethod:""
        }

      };
    //aici folosim pentru a salva detaliile clientilor de la shipping adres in store
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        //pastram statusu initial si schimbarile care o sa le face o sa fie doar in cart si mai exact in shippingAddress
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };

      //aici definim un nou caz pentru a salva paymentu in paymentMethod
      case "SAVE_PAYMENT_METHOD":
        return{
          ...state,
          cart:{...state.cart,paymentMethod:action.payload}
        }
    default:
      return state;
  }
}

//aici creem wraperu store pe care il utilizam pentru a avea acces la store din orice component
export function StoreProvider(props) {
  //si aici definim un state si dispachu cu useReducer care  acccepta un reducer si statu initial
  const [state, dispatch] = useReducer(reducer, initialState);
  // definim valeu cu state si dispach care va ajuta sa schimbe state
  const value = { state, dispatch };
  //iar aici facem un return, Store.Provider si ii setam value cu value creeat
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
