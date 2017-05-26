const wesh = console.log

const pipe = (fn, ...fns) => (...args) => fns.reduce((acc, fn) => fn(acc), fn(...args))

const compose = (...fn) => pipe(...fn.reverse())

const dispatch = (fn, ...args) => fn(...args)

const toUper = (filter, ...e) => [ filter.toUpperCase(), e.map(e => ({ name: `${e.name.first}${e.name.last}`.toUpperCase(), id: e.login.username })) ]

const match = ([ filter, rest ]) => rest.filter(e => e.name.indexOf(filter) !== -1)

const bakeUserFilter = users => storage.filterUsers = storage.users.filter(e => users.find(user => e.login.username === user.id))

const bakeFilter = compose(bakeUserFilter, match, toUper)

const filter = value => new Promise(s => s(bakeFilter(value, ...storage.users)))

const getResult = e => e.results

const getUserInfos = users => users.map(({ gender, email, name, picture, login }) => ({ gender, email, name, picture, login }))

const filterUser = compose(getUserInfos, getResult)

const setUserStorage = e => storage.users = e

const setFilterStorage = e => storage.filterUsers = e

const setLocalStorage = () => localStorage.users = JSON.stringify(storage.users)

const updateUser = compose(m.redraw, setLocalStorage, setFilterStorage, setUserStorage)

const getUser = () => fetch('https://randomuser.me/api/?results=500')
    .then(res => res.json())
    .then(filterUser)
    .then(updateUser)

const getLocaleStorage = () => new Promise(s => s(storage.users = storage.filterUsers = JSON.parse(localStorage.users)))

const userListNode = () => storage.filterUsers.map(e => m('li', [ 
    m('strong', `${e.name.first} ${e.name.last} `), 
    m('em', `(${e.gender})`), 
    m('a', { href:'/profile' }, 
    'Open') ]))

const storage = {
    users: [],
    filterUsers: []
}

const Search = {
    oninit: () => {
        if (localStorage.users) getLocaleStorage()
        else getUser()
    },
    filter: e => dispatch(filter, e.target.value),  
    view: ({ state }) => [
            m('header.header', [
				m('h1', 'Search'),
				m(`input#filter[placeholder='Search'][autofocus]`, { onkeyup: state.filter }),
			]),
            m('section#loader', { style: { display: storage.users.length > 0 ? 'none' : '' } }, [
                m('h4', 'Loading...')
			]),
            m('section#main', { style: { display: storage.users.length > 0 ? '' : 'none' } }, [
                m('h4', 'Users List'),
                m('ul', userListNode())
			]),
        ]
			
}

const Profil = {
    view ({ state }) {

    }
}

m.route(document.getElementById('app'), '/', {
	'/': Search
})