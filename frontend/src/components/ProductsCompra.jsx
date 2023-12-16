import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { updateCart } from '../funciones-componentes/updateCart';
import { getUserDate } from '../funciones-componentes/getUserDate';




export const ProductsCompra = () => {


    const token = document.cookie.split('=')[1];

    const navigate = useNavigate()

    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

    const [inputValueLimMax, setInputValueLimMax] = useState("");
    const [inputValuePage, setInputValuePage] = useState("");
    const [mostrarTodos, setMostrarTodos] = useState(false);





    const [formPagination, setPagination] = useState({
        hasNextPage: false,
        hasPrevPage: false,
        limit: "",
        nextPage: "",
        page: "",
        totalDocs: "",
        totalPages: "",
        docs: []

    });





    async function getDatos(limit, page) {



        try {
            const response = await fetch(`http://localhost:4000/api/products?limit=${limit = limit ? limit : ""}&page=${page = page ? page : ""}`, {

            method: 'GET',
            headers: {
                'Authorization': `${token}`,
                'Content-type': 'application/json'
            }
        });

            if (!response.ok) {
                throw new Error('Not found Products');
            }

            const data = await response.json();

            console.log(`http://localhost:4000/api/products?limit=${limit}&page=${page}`)
            console.log(data)


            setPagination((prevPagination) => ({
                ...prevPagination,
                hasNextPage: data.hasNextPage,
                hasPrevPage: data.hasPrevPage,
                limit: data.limit,
                nextPage: data.nextPage,
                page: data.page,
                totalDocs: data.totalDocs,
                totalPages: data.totalPages,
                docs: data.docs
            }));

            setInputValuePage(page)



        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        getDatos();


    }, []);

    const handleRowMouseEnter = (index) => {
        setHoveredRowIndex(index);
    };

    const handleRowMouseLeave = () => {
        setHoveredRowIndex(null);
    };





    const handlePageChange = () => {
        console.log("Evento cambio de página")
    }

    const handlePageClick = (paginaActual) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            page: paginaActual,
        }));

        console.log("Se eejctuta HandlePageCLicks: ", formPagination.limit, paginaActual)

        getDatos(formPagination.limit, paginaActual)



    };

    const handleMostrarTodosChange = () => {
        setMostrarTodos(!mostrarTodos)

        if (!mostrarTodos) {
            getDatos(formPagination.totalDocs, 1)

        } else {
            getDatos()

        }
    }

    const generarItemsPagination = () => {
        const { page, totalPages } = formPagination;
        const items = [];

        // Define el rango de páginas a mostrar
        const range = 5; // Puedes ajustar este valor para cambiar cuántas páginas se muestran

        // Calcula el rango de páginas a mostrar
        const startIndex = Math.max(1, page - Math.floor(range / 2));
        const endIndex = Math.min(totalPages, startIndex + range - 1);

        for (let i = startIndex; i <= endIndex; i++) {
            items.push({
                pageNumber: i,
                isActive: i === page,
            });
        }

        return items;
    };
    const handleLimPag = () => {

        const limitPage = inputValueLimMax
        console.log("Limite por página: ", inputValueLimMax)
        setPagination((prevPagination) => ({
            ...prevPagination,
            limi: limitPage,
            page: 1
        }))
        console.log("LimitPage y FormPagination: ", limitPage, formPagination.page)
        getDatos(limitPage, 1)

    }

    const handlePage = () => {
        console.log("HandlePAge: ", inputValuePage)

        setPagination((prevPagination) => ({
            ...prevPagination,
            page: inputValuePage
        }))

        getDatos(formPagination.limit, inputValuePage)
    }

    const handleSiguiente = () => {

        if (formPagination.hasNextPage) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: (formPagination.page + 1) <= formPagination.totalPages ? formPagination.page + 1 : formPagination.page,
                hasNextPage: formPagination.page + 1 < formPagination.totalPages
            }));


            getDatos(formPagination.limit, formPagination.page + 1)
        }
    }

    const handleAnterior = () => {
        if (formPagination.hasPrevPage) {
            setPagination((prevPagination) => ({
                ...prevPagination,
                page: formPagination.page - 1 > 0 ? formPagination.page - 1 : formPagination.page,
                hasPrevPage: formPagination.page - 1 > 0
            }));
            getDatos(formPagination.limit, formPagination.page - 1)
        }
    }

    const handleAddToCart = async (product) => {
        const idCart = await getUserDate(token)
        try {
            if (await updateCart(idCart.cart._id, product._id, token, 1)) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Producto agregado con éxito!!",
                    showConfirmButton: false,
                    timer: 3000, // Puedes configurar el temporizador si lo deseas
                    backdrop: false, // Fondo no interactivo
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: "Producto no fue agregado",
                showConfirmButton: false,
                timer: 3000, // Puedes configurar el temporizador si lo deseas
                backdrop: false, // Fondo no interactivo
            });
        }

    }

    const handleIrCart = () => {

        navigate('/cart')
    }


    return (

        <div>


            <div >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h1>Productos</h1>
                    <div style={{ marginLeft: 'auto' }}>
                        <button
                            onClick={handleIrCart}
                            style={{
                                border: 'none',  // Elimina el borde
                                background: 'transparent',  // Fondo transparente
                                padding: 0,  // Sin relleno
                                cursor: 'pointer',  // Cambia el cursor al estilo de puntero al pasar por encima
                                outline: 'none',  // Elimina el contorno al hacer clic
                            }} >

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img src="\img\irCart.png" alt="Carrito" width="80" height="80" />
                            </div>
                        </button>
                    </div>
                </div>


                <hr />
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        defaultChecked={mostrarTodos}
                        onChange={handleMostrarTodosChange}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        Mostrar Todos
                    </label>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr className="table-dark">
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Price</th>
                            <th scope="col">Category</th>
                            <th scope="col">Status</th>
                            <th scope="col">Code</th>
                            <th scope="col">Agregar</th>
                        </tr>
                    </thead>
                    <tbody>

                        {formPagination.docs.map((product, index) => {
                            let rowColor = index % 2 === 0 ? "table-active" : "table-light";
                            if (hoveredRowIndex === index) {
                                rowColor = "table-info";
                            }

                            return (
                                <tr
                                    key={index}
                                    className={rowColor}
                                    onMouseEnter={() => handleRowMouseEnter(index)}
                                    onMouseLeave={handleRowMouseLeave}
                                >
                                    <th scope="row">{product.title}</th>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.status === true ? "Activo" : "Desactivo"}</td>
                                    <td>{product.code}</td>
                                    <td>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            style={{
                                                border: 'none',  // Elimina el borde
                                                background: 'transparent',  // Fondo transparente
                                                padding: 0,  // Sin relleno
                                                cursor: 'pointer',  // Cambia el cursor al estilo de puntero al pasar por encima
                                                outline: 'none',  // Elimina el contorno al hacer clic
                                            }} >

                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <img src="\img\shopping-cart-add_25345.png" alt="Carrito" width="20" height="20" />
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <ul className="pagination">

                        <li className={formPagination.hasPrevPage ? "page-item" : "page-item disabled"}>
                            <a className="page-link" href="#" onClick={handleAnterior}>&laquo;</a>
                        </li>
                        {generarItemsPagination().map((item, index) => (
                            <li key={index} className={item.isActive ? 'page-item active' : 'page-item'}>
                                <a className="page-link" href="#" onClick={() => handlePageClick(item.pageNumber)}>
                                    {item.pageNumber}
                                </a>
                            </li>
                        ))}
                        <li className={formPagination.hasNextPage ? "page-item" : "page-item disabled"}>
                            <a className="page-link" href="#" onClick={handleSiguiente} >&raquo;</a>
                        </li>
                        <div className="input-group w-45">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Página"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                style={{ marginLeft: '10px', width: '50px' }}
                                id="txtPage"
                                name='txtPage'
                                value={inputValuePage}
                                onChange={(e) => setInputValuePage(e.target.value)}

                            />
                            <button className={!mostrarTodos ? "btn btn-primary" : "btn btn-primary disabled"} type="button" id="btnPage" onClick={handlePage}>
                                Page
                            </button>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Máximo por página"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                                style={{ marginLeft: '10px' }}
                                id="txtLimPage"
                                name='txtLimPage'
                                value={inputValueLimMax}
                                onChange={(e) => setInputValueLimMax(e.target.value)}
                            />
                            <button className={!mostrarTodos ? "btn btn-primary" : "btn btn-primary disabled"} type="button" id="btnMaxPage" onClick={handleLimPag}>
                                MaxPage
                            </button>

                        </div>
                    </ul>

                </div>

                <div>

                </div>


            </div>

        </div>


    );
};