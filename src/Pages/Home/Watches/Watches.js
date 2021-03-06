import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import Watch from '../Watch/Watch';

const Watches = () => {
    const [watches, setWatches] = useState([]);
    console.log(watches)

    useEffect(() => {
        fetch('https://blooming-refuge-00817.herokuapp.com/watches')
            .then(res => res.json())
            .then(data => setWatches(data))
    }, [])

    return (
        <div className="App">
            <Container sx={{ pt: 5 }}>
                <Typography sx={{ pt: 8, color: '#A99577' }} variant="subtitle1" className="Titillium" gutterBottom component="div">
                    OUR PRODUCTS
                </Typography>
                <Typography className="Titillium" sx={{ mb: 5 }} variant="h3" gutterBottom component="div">
                    Our Bestsellers
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {
                            watches.slice(0, 6).map(watch => <Watch
                                key={watch._id}
                                watch={watch}
                            ></Watch>)
                        }
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default Watches;