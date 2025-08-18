import { useMemo, useState } from "react";
import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import { PageTitle } from "../components/common/PageTitle";
import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../config/config";

const StockPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [stock, setStock] = useState([]);

    useEffect(() => {
        handleGetStock();
        return () => { }
    }, [])

    const handleGetStock = async () => {
        try {
            const url = `${BASE_URL}/stock`;
            const response = await axios.get(url);
            if (response.data) {
                setStock(response.data.data)
            }
        } catch (error) {
            console.log("Failed get stock", error);
        }
    }

    // Filter by search
    const filteredData = useMemo(() => {
        if (!searchQuery) {
            return stock;
        }

        return stock.filter((item) => (item.item_code.toLowerCase().includes(searchQuery.toLowerCase())
            || item.item_name.toLowerCase().includes(searchQuery.toLowerCase())))
    }, [stock, searchQuery])

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    }

    return (
        <Container maxWidth="lg">
            <PageTitle title="Stock Barang" />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Cari barang..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: 300 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Show</InputLabel>
                        <Select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(e.target.value)}
                            label="Show"
                        >
                            <MenuItem value={6}>6 entries</MenuItem>
                            <MenuItem value={10}>10 entries</MenuItem>
                            <MenuItem value={25}>25 entries</MenuItem>
                            <MenuItem value={50}>50 entries</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><b>No</b></TableCell>
                            <TableCell><b>Kode Barang</b></TableCell>
                            <TableCell><b>Nama Barang</b></TableCell>
                            <TableCell align="center"><b> Jumlah Stok</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice().reverse().map((product, index) => (
                            <TableRow key={product.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{product.item_code}</TableCell>
                                <TableCell>{product.item_name}</TableCell>
                                <TableCell align="center">{product.qty}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                </Typography>

                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                />
            </Box>
        </Container>
    )
}

export default StockPage;