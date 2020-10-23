module.exports = function init(site) {

  let collection_name = 'accounting_guide_accounts'

  let source = {
    name: 'Guide Accounts System',
    ar: 'نظام دليل حسابات '
  }

  let image_url = '/images/accounting_guide_accounts.png'
  let add_message = {
    name: 'New Guide Accounts Added',
    ar: 'تم أضافة دليل حسابات جديدة'
  }
  let update_message = {
    name: ' Guide Accounts Updated',
    ar: 'تم تعديل دليل حسابات'
  }
  let delete_message = {
    name: ' Guide Accounts Deleted',
    ar: 'تم حذف دليل حسابات '
  }


  site.on('mongodb after insert', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: add_message,
          value: {
            name: result.doc.name_ar,
            ar: result.doc.name_ar
          },
          add: result.doc,
          action: 'add'
        },
        result: result
      })
    }
  })

  site.on('mongodb after update', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: update_message,
          value: {
            name: result.old_doc.name_ar,
            ar: result.old_doc.name_ar
          },
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        },
        result: result
      })
    }
  })


  site.on('mongodb after delete', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: delete_message,
          value: {
            name: result.doc.name_ar,
            ar: result.doc.name_ar
          },
          delete: result.doc,
          action: 'delete'
        },
        result: result
      })
    }
  })

}