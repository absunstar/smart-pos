module.exports = function init(site) {
  const $analysis = site.connectCollection("analysis")

  site.post({
    name: "/api/period_analysis/all",
    path: __dirname + "/site_files/json/period_analysis.json"

  })

  site.get({
    name: 'images',
    path: __dirname + '/site_files/images/'
  })

  site.get({
    name: "analysis",
    path: __dirname + "/site_files/html/index.html",
    parser: "html",
    compress: true
  })

  site.on('[company][created]', (doc) => {
    $analysis.add(
      {
        code: "1-Test",
        name_ar: 'تحليل إفتراضي',
        name_en: "Default Analysis",
        price: 1,
        immediate: true,
        image_url: '/images/analysis.png',
        company: {
          id: doc.id,
          name_ar: doc.name_ar,
          name_en: doc.name_en
        },
        branch: {
          code: doc.branch_list[0].code,
          name_ar: doc.branch_list[0].name_ar,
          name_en: doc.branch_list[0].name_en
        },
        active: true,
      },
      (err, doc1) => {

      },
    );
  });

  site.post("/api/analysis/add", (req, res) => {
    let response = {
      done: false
    }
    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let analysis_doc = req.body
    analysis_doc.$req = req
    analysis_doc.$res = res

    analysis_doc.company = site.get_company(req);
    analysis_doc.branch = site.get_branch(req);

    analysis_doc.add_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (typeof analysis_doc.active === 'undefined') {
      analysis_doc.active = true
    }

    $analysis.find({
      where: {
        'company.id': site.get_company(req).id,
        $or: [{
          'name_ar': analysis_doc.name_ar
        },{
          'name_en': analysis_doc.name_en
        }]
    
      }
    }, (err, doc) => {
      if (!err && doc) {
        response.error = 'Name Exists'
        res.json(response)
      } else {
        let num_obj = {
          company: site.get_company(req),
          screen: 'analysis',
          date: new Date()
        };

        let cb = site.getNumbering(num_obj);
        if (!analysis_doc.code && !cb.auto) {
          response.error = 'Must Enter Code';
          res.json(response);
          return;

        } else if (cb.auto) {
          analysis_doc.code = cb.code;
        }

        $analysis.add(analysis_doc, (err, doc) => {
          if (!err) {
            response.done = true
            response.doc = doc
          } else {
            response.error = err.message
          }
          res.json(response)
        })
      }
    })
  })

  site.post("/api/analysis/update", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let analysis_doc = req.body

    analysis_doc.edit_user_info = site.security.getUserFinger({
      $req: req,
      $res: res
    })

    if (analysis_doc.id) {
      $analysis.edit({
        where: {
          id: analysis_doc.id
        },
        set: analysis_doc,
        $req: req,
        $res: res
      }, err => {
        if (!err) {
          response.done = true
        } else {
          response.error = 'Code Already Exist'
        }
        res.json(response)
      })
    } else {
      response.error = 'no id'
      res.json(response)
    }
  })

  site.post("/api/analysis/view", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    $analysis.findOne({
      where: {
        id: req.body.id
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


  site.post("/api/analysis/delete", (req, res) => {
    let response = {
      done: false
    }

    if (!req.session.user) {
      response.error = 'Please Login First'
      res.json(response)
      return
    }

    let id = req.body.id

    if (id) {
      $analysis.delete({
        id: id,
        $req: req,
        $res: res
      }, (err, result) => {
        if (!err) {
          response.done = true
        } else {
          response.error = err.message
        }
        res.json(response)
      })
    } else {
      response.error = 'no id'
      res.json(response)
    }
  })

  site.post("/api/analysis/all", (req, res) => {
    let response = {
      done: false
    }

    let where = req.body.where || {}

    where['company.id'] = site.get_company(req).id
    where['branch.code'] = site.get_branch(req).code

    if (where['name']) {
      where['name'] = new RegExp(where['name'], "i");
    }

    $analysis.findMany({
      select: req.body.select || {},
      where: where,
      sort: req.body.sort || {
        id: -1
      },
      limit: req.body.limit
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

}