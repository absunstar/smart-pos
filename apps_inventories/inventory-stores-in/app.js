module.exports = function init(site) {

  const $stores_in = site.connectCollection("stores_in")

  $stores_in.deleteDuplicate({ number: 1 }, (err, result) => {
    $stores_in.createUnique({ number: 1 }, (err, result) => {
    })
  })

  site.on('[stores_items][item_name][change]', obj => {
    let barcode = obj.sizes_list.map(_obj => _obj.barcode)
    let size = obj.sizes_list.map(_obj => _obj.size)

    $stores_in.findMany({ 'company.id': obj.company.id, 'items.size': size, 'items.barcode': barcode }, (err, doc) => {
      doc.forEach(_doc => {
        _doc.items.forEach(_items => {
          obj.sizes_list.forEach(_size => {
            if (_items.barcode == _size.barcode)
              _items.size = _size.size
          })
        });
        $stores_in.update(_doc);
      });
    });
  });


  site.on('[store_in][account_invoice][invoice]', function (obj) {
    $stores_in.findOne({ id: obj }, (err, doc) => {
      doc.invoice = true
      $stores_in.update(doc);
    });
  });


  /*  $stores_in.busy1 = false;
   site.on('[stores_items][store_in]', itm => {
     if ($stores_in.busy1 == true) {
       setTimeout(() => {
         site.call('[stores_items][store_in]', Object.assign({}, itm))
       }, 200);
       return
     }
     $stores_in.busy1 = true;
     let obj = {
       items: [],
       total: 0,
       image_url: '/images/store_in.png',
       store: itm.store,
       vendor: itm.vendor,
       date: new Date(itm.date),
       number: new Date().getTime().toString(),
       total_value: 0,
       net_value: 0,
       total_tax: 0,
       total_discount: 0,
       price: itm.price,
       cost: itm.cost,
     }
     obj.items.push(itm)
 
     $stores_in.add(obj, (err, doc) => {
       if (!err) {
         $stores_in.busy1 = false;
       }
     })
 
   })
 
   site.on('[stores_transfer][store_in][+]', doc => {
     doc.items.forEach(itm => {
       let obj = {
         items: [],
         total: 0,
         image_url: '/images/store_in.png',
         store: doc.store_to,
         vendor: doc.vendor,
         safe: doc.safe,
         date: new Date(doc.date),
         number: new Date().getTime().toString(),
         supply_number: doc.number,
         total_value: 0,
         net_value: 0,
         total_tax: 0,
         total_discount: 0,
         price: itm.price,
         cost: itm.cost,
         current_status: 'transferred'
       }
       obj.items.push(itm)
       $stores_in.add(obj, (err, doc) => {
         if (!err) {
           doc.items.forEach(itm => {
 
             delete itm.vendor
             delete itm.store
             itm.company = doc.company
             itm.branch = doc.branch
             itm.store = doc.store
             itm.vendor = doc.vendor
             itm.date = doc.date
             itm.transaction_type = 'in'
             itm.supply_number = doc.supply_number
             itm.current_status = ' '
 
             let nwitm = itm
             nwitm.current_status = 'transferred'
             let obj = {
               'itm.current_status': 'transferred',
               name: itm.name,
               vendor: doc.vendor,
               store: doc.store,
               date: doc.date,
               item: nwitm,
             }
 
             site.call('[stores_transfer][stores_items]', obj)
             site.call('please track item', Object.assign({}, itm))
 
           });
         }
       })
     });
   })
 
   site.on('[eng_item_debt][stores_in][+]', itm => {
 
     let sizes = [{
       name: itm.name,
       count: 1,
       total: 0,
       total_value: itm.price,
       net_value: itm.price,
       size: itm.size,
       price: itm.price,
       name: itm.name
     }]
 
     let obj = {
       date: itm.date,
       image_url: '/images/store_in.png',
       items: sizes,
       store: itm.store,
       vendor: itm.vendor,
       date: new Date(itm.date),
       number: new Date().getTime().toString(),
       total_value: 0,
       net_value: 0,
       total_tax: 0,
       total_discount: 0,
       count: itm.count
     }
     $stores_in.add(obj)
   })
  */
  site.post({
    name: '/api/stores_in/types/all',
    path: __dirname + '/site_files/json/types.json'
  })

  site.get({
    name: "stores_in",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: false
  })

  function addZero(code, number) {
    let c = number - code.toString().length
    for (let i = 0; i < c; i++) {
      code = '0' + code.toString()
    }
    return code
  }

  $stores_in.newCode = function () {

    let y = new Date().getFullYear().toString().substr(2, 2)
    let m = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'][new Date().getMonth()].toString()
    let d = new Date().getDate()
    let lastCode = site.storage('ticket_last_code') || 0
    let lastMonth = site.storage('ticket_last_month') || m
    if (lastMonth != m) {
      lastMonth = m
      lastCode = 0
    }
    lastCode++
    site.storage('ticket_last_code', lastCode)
    site.storage('ticket_last_month', lastMonth)
    return y + lastMonth + addZero(d, 2) + addZero(lastCode, 4)
  }

  site.post("/api/stores_in/add", (req, res) => {
    let response = {}
    response.done = false
    if (!req.session.user) {
      res.json(response)
      return;
    }

    let stores_in_doc = req.body

    stores_in_doc.company = site.get_company(req)
    stores_in_doc.branch = site.get_branch(req)
    stores_in_doc.number = $stores_in.newCode();
    stores_in_doc.add_user_info = site.security.getUserFinger({ $req: req, $res: res })

    stores_in_doc.$req = req
    stores_in_doc.$res = res

    stores_in_doc.date = site.toDateTime(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {
      itm.current_count = site.toNumber(itm.current_count)
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)
    stores_in_doc.net_value = site.toNumber(stores_in_doc.net_value)

    $stores_in.add(stores_in_doc, (err, doc) => {

      if (!err) {

        response.done = true
        response.doc = doc

        if (doc.posting) {

          doc.items.forEach(_itm => {
            _itm.type = 'sum'
            _itm._status = doc.type.id
            _itm.store = doc.store
            _itm.company = doc.company
            _itm.branch = doc.branch

            site.call('[transfer_branch][stores_items][add_balance]', _itm)

            _itm.number = doc.number
            _itm.vendor = doc.vendor
            _itm.date = doc.date
            _itm.source_type = doc.type
            _itm.transaction_type = 'in'
            _itm.current_status = 'storein'
            site.call('please track item', Object.assign({}, _itm))

          })
        }

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/stores_in/update", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_in_doc = req.body
    stores_in_doc.edit_user_info = site.security.getUserFinger({ $req: req, $res: res })

    stores_in_doc.vendor = site.fromJson(stores_in_doc.vendor)
    stores_in_doc.seasonName = stores_in_doc.seasonName
    stores_in_doc.type = site.fromJson(stores_in_doc.type)
    stores_in_doc.date = new Date(stores_in_doc.date)

    stores_in_doc.items.forEach(itm => {
      itm.count = site.toNumber(itm.count)
      itm.cost = site.toNumber(itm.cost)
      itm.price = site.toNumber(itm.price)
      itm.total = site.toNumber(itm.total)
    })

    stores_in_doc.total_value = site.toNumber(stores_in_doc.total_value)

    if (stores_in_doc._id) {
      $stores_in.edit({
        where: {
          _id: stores_in_doc._id
        },
        set: stores_in_doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })

  site.post("/api/stores_in/posting", (req, res) => {
    if (req.session.user === undefined)
      res.json(response)

    let response = {}
    response.done = false

    let stores_in_doc = req.body

    stores_in_doc.edit_user_info = site.security.getUserFinger({ $req: req, $res: res })

    if (stores_in_doc._id) {
      $stores_in.edit({
        where: {
          _id: stores_in_doc._id
        },
        set: stores_in_doc,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
          response.doc = result.doc

          result.doc.items.forEach(_itm => {
            _itm._status = result.doc.type.id
            _itm.store = result.doc.store
            _itm.company = result.doc.company
            _itm.branch = result.doc.branch

            if (result.doc.posting) {
              _itm.type = 'sum'
              _itm.transaction_type = 'in'
              _itm.current_status = 'storein'
            } else {
              _itm.type = 'minus'
              _itm.transaction_type = 'out'
              _itm.current_status = 'r_storein'
            }

            site.call('[transfer_branch][stores_items][add_balance]', _itm)
            delete _itm._status
            _itm.number = result.doc.number
            _itm.vendor = result.doc.vendor
            _itm.date = result.doc.date
            _itm.source_type = result.doc.type

            if (result.doc.posting)
              site.call('please track item', Object.assign({}, _itm))
            else site.call('please out item', Object.assign({}, _itm))

          })

        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      res.json(response)
    }
  })


  site.post("/api/stores_in/delete", (req, res) => {
    let response = {}
    response.done = false
    if (req.session.user === undefined) {
      res.json(response)
    }
    let stores_in_doc = req.body
    if (stores_in_doc._id) {
      $stores_in.delete({
        where: {
          _id: stores_in_doc._id
        },
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
          if (stores_in_doc.posting) {
    
            stores_in_doc.items.forEach(_itm => {
              _itm._status = stores_in_doc.type.id
              _itm.store = stores_in_doc.store
              _itm.company = stores_in_doc.company
              _itm.branch = stores_in_doc.branch

              _itm.type = 'minus'
              _itm.transaction_type = 'out'
              _itm.current_status = 'd_storein'

              site.call('[transfer_branch][stores_items][add_balance]', _itm)
              delete _itm._status
              _itm.number = stores_in_doc.number
              _itm.vendor = stores_in_doc.vendor
              _itm.date = stores_in_doc.date
              _itm.source_type = stores_in_doc.type

              
              site.call('please out item', Object.assign({}, _itm))

            });

          }
          res.json(response)
        }
      })
    } else res.json(response)
  })

  site.post("/api/stores_in/view", (req, res) => {
    let response = {}
    response.done = false
    $stores_in.findOne({
      where: {
        _id: site.mongodb.ObjectID(req.body._id)
      }
    }, (err, doc) => {
      if (!err) {
        response.done = true
        response.doc = doc
      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  site.post("/api/stores_in/all", (req, res) => {
    let response = {}
    response.done = false
    let where = req.body.where || {}

    let search = req.body.search

    if (search) {
      where.$or = []

      where.$or.push({
        'vendor.name': new RegExp(search, "i")
      })

      where.$or.push({
        'vendor.mobile': new RegExp(search, "i")
      })

      where.$or.push({
        'vendor.phone': new RegExp(search, "i")
      })

      where.$or.push({
        'vendor.national_id': new RegExp(search, "i")
      })

      where.$or.push({
        'vendor.email': new RegExp(search, "i")
      })

      where.$or.push({
        'store.name': new RegExp(search, "i")
      })

      where.$or.push({
        'store.number': new RegExp(search, "i")
      })

      where.$or.push({
        'store.payment_method.ar': new RegExp(search, "i")
      })

      where.$or.push({
        'store.payment_method.en': new RegExp(search, "i")
      })

    }

    where['company.id'] = site.get_company(req).id
    where['branch.code'] = site.get_branch(req).code

    if (where['shift_code']) {
      where['shift.code'] = new RegExp(where['shift_code'], 'i')
      delete where['shift_code']
    }

    if (where && where['notes']) {
      where['notes'] = new RegExp(where['notes'], 'i')
    }

    if (where && where['number']) {
      where['number'] = new RegExp(where['number'], 'i')
    }

    if (where && where['supply_number']) {
      where['supply_number'] = new RegExp(where['supply_number'], 'i')
    }

    if (where && where['items.ticket_code']) {
      where['items.ticket_code'] = new RegExp(where['items.ticket_code'], 'i')
    }

    if (where.date) {
      let d1 = site.toDate(where.date)
      let d2 = site.toDate(where.date)
      d2.setDate(d2.getDate() + 1)
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
    } else if (where && where.date_from) {
      let d1 = site.toDate(where.date_from)
      let d2 = site.toDate(where.date_to)
      d2.setDate(d2.getDate() + 1);
      where.date = {
        '$gte': d1,
        '$lt': d2
      }
      delete where.date_from
      delete where.date_to
    }

    $stores_in.findMany({
      select: req.body.select || {},
      limit: req.body.limit,
      where: where,
      sort: { id: -1 }
    }, (err, docs, count) => {
      if (!err) {
        response.done = true
        response.list = docs
        response.count = count

      } else {
        response.error = err.message
      }
      res.json(response)
    })
  })

  /* site.getStoresIn = function (req, callback) {
    callback = callback || {};

    let where = req.data.where || {};
    where['company.id'] = site.get_company(req).id
    where['branch.code'] = site.get_branch(req).code
    where['invoice'] = false
    $stores_in.findOne({
      where: where
    }, (err, doc) => {
      if (!err && doc)
        callback(doc)
      else callback(false)
    })
  } */

}