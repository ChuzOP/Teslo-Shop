import React, { useEffect, useState } from 'react'
import useSWR from 'swr';

import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage = () => {
  const { data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 *1000
  });

  const [refreshIn, setRefreshIn] = useState(30);
  useEffect(() => {
    const interval = setInterval( () => {
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
    }, 1000 )
  
    return () => clearInterval(interval)
  }, [])
  

  if (!data && !error){
    return <></>
  }

  if( error ){
    console.log(error);
    return <Typography variant='h3' color='error'>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithouhtInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout title={'Dashboard'} subTitle={'Estadisticas generales'} icon={ <DashboardOutlined />}>
        <Grid container spacing={2} mt={2} >
          <SummaryTile
            title={ numberOfOrders }
            subtitle='Ordenes Totales'
            icon={ <CreditCardOutlined color="secondary" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ notPaidOrders }
            subtitle='Ordenes Pendientes'
            icon={ <CreditCardOffOutlined color="error" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ paidOrders }
            subtitle='Ordenes Pagadas'
            icon={ <AttachMoneyOutlined color="success" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ numberOfClients }
            subtitle='Clientes'
            icon={ <GroupOutlined color="primary" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ numberOfProducts }
            subtitle='Productos'
            icon={ <CategoryOutlined color="warning" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ productsWithouhtInventory }
            subtitle='Productos sin existencias'
            icon={ <CancelPresentationOutlined color="error" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ lowInventory }
            subtitle='Bajo Inventario'
            icon={ <ProductionQuantityLimitsOutlined color="warning" sx={{ fontSize: 50 }} /> }
          />
          <SummaryTile
            title={ refreshIn }
            subtitle='Acutalización en:'
            icon={ <AccessTimeOutlined color="secondary" sx={{ fontSize: 50 }} /> }
          />
        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage