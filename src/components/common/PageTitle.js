import { Box, Typography } from "@mui/material"

export const PageTitle = ({ title }) => {
    return (
        <Box mb={4}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 600 }}
            >{title}</Typography>
            <Box sx={{ height: 4, width: 60, bgcolor: 'primary.main', borderRadius: 2 }} />
        </Box>
    )
}