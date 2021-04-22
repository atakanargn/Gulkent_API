const express = require('express');
const app = express();
const mongoose = require('mongoose');


var cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

// Db Connection
mongoose.connect(
  process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Mongogdb Connected!")
  })

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const Api_Card_Route = require('./routes/api/Card');
const Api_CardType_Route = require('./routes/api/CardType');
const Api_Customer_Route = require('./routes/api/Customer');
const Api_Hes_Route = require('./routes/api/Hes');

// Sunum Router
const Sunum_Route = require('./routes/sunum');

// Admin Route
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')

// Models
const CardType = require('./model/CardType')
const Card = require('./model/Card')
const Customer = require('./model/Customer')
const Hes = require('./model/Hes')
const transportReport = require('./model/TransportReport')
const budgetReport = require('./model/BudgetReport')

AdminBro.registerAdapter(AdminBroMongoose)

const adminBro = new AdminBro({
  dashboard: {
    handler: async () => {
      return { some: 'output' }
    },
    component: AdminBro.bundle('./components/admin.jsx')
  },
  databases: [mongoose],
  resources: [
    {
      resource: Customer,
      options: {parent:{
        name:'Müşteri İşlemleri',
        icon:'fas fa-id-card'
      },
        properties: {
          _id:{
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          /*card_type:{
            availableValues: [
              {value: 'male', label: 'Male'},
              {value: 'female', label: 'Female'},
            ],
          },*/ },},},
    { resource: Card, options: {parent:{
      name:'Kartlar',
      icon:'fas fa-id-card'
    }, listProperties: ['uid', 'status'] } },
    { resource: CardType, options: {parent:{
      name:'Kartlar',
      icon:'fas fa-id-card'
    }, properties:{
      

    },listProperties: ['card_type', 'description', 'fee', 'transfer_fee', 'visa_time'] } },
    { resource: transportReport,options: {
      parent:{
        name:'Raporlar',
        icon:'fas fa-id-card'
      },
      properties: {
        _id:{
          isVisible: { list: false, filter: false, show: false, edit: false },
        }
      }
    }},
    { resource: budgetReport,options: {
      parent:{
        name:'Raporlar',
        icon:'fas fa-id-card'
      },
      properties: {
        _id:{
          isVisible: { list: false, filter: false, show: false, edit: false },
        }
      }
    }},
    {resource:Hes,options:{
      parent:{
        name:'Müşteri İşlemleri',
        icon:'fas fa-id-card'
      },
    }
  }
  ],
  locale: {
    translations: {
      actions: {
        new: 'Yeni',
        edit: 'Düzenle',
        show: 'Görüntüle',
        delete: 'Sil',
        bulkDelete: 'Hepsini sil',
        list: 'Listele',
      },
      buttons: {
        save: 'Kaydet',
        addNewItem: 'Yeni kayıt ekle',
        filter: 'Filtrele',
        applyChanges: 'Değişiklikleri Kaydet',
        resetFilter: 'Temizle',
        confirmRemovalMany: '{{count}} adet kayıt silinecek',
        confirmRemovalMany_plural: '{{count}} adet kayıt silinecek',
        logout: 'Çıkış',
        createFirstRecord: 'İlk kaydı oluştur!',
      },
      labels: {
        Hes:'HES Kodları',
        Card: 'Kartlar',
        Customer: 'Müşteriler',
        transportReport: 'Basım Raporları',
        budgetReport : 'Dolum Raporları',
        CardType:'Kart Tipi',
        navigation: '',
        pages: 'Sayfalar',
        selectedRecords: 'Seçili ({{selected}})',
        filters: 'Filtrele',
        adminVersion: 'Admin: 0.0.1',
        appVersion: 'GülKent Kart: 0.0.1',
        loginWelcome: 'GülKent Kart Yönetici Paneli',
      },
      messages: {
        loginWelcome: '',
    }}
  },
  rootPath: '/admin',
  branding: {
    companyName: 'Gülkent Kart',
    softwareBrothers: false,
    logo: false
  },
})

const admin_Router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
      if (email == "ispartahalkotobusleri@gmail.com" && password == "ss18koop") {
          return 'admin';
      }
      return false
  },
  cookiePassword: '*0HWAGDG-q*9HYH-*AD*9sdh*-jh',
})

// const admin_Router = AdminBroExpress.buildRouter(adminBro)

app.use(adminBro.options.rootPath, admin_Router)

// Route Middleware
app.use('/api/card/', Api_Card_Route);
app.use('/api/card_type/', Api_CardType_Route);
app.use('/api/customer/', Api_Customer_Route);
app.use('/api/hes/', Api_Hes_Route);

app.use('/', Sunum_Route);

// Run
app.listen(8080, "0.0.0.0");