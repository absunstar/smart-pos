module.exports = function init(site) {

  let collection_name = 'school_grade'

  let source = {
    name: 'School Grades System',
    ar: ' نظام المراحل الدراسية'
  }

  let image_url = '/images/school_grade.png'
  let add_message = {
    name: 'New School Years Added',
    ar: 'تم إضافة مرحلة دراسية جديدة'
  }
  let update_message = {
    name: ' School Years Updated',
    ar: 'تم تعديل مرحلة دراسية'
  }
  let delete_message = {
    name: ' School Years Deleted',
    ar: 'تم حذف مرحلة دراسية '
  }


  site.on('mongodb after insert', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: add_message,
          value: {
            name: result.doc.name,
            ar: result.doc.name
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
            name: result.old_doc.name,
            ar: result.old_doc.name
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
            name: result.doc.name,
            ar: result.doc.name
          },
          delete: result.doc,
          action: 'delete'
        },
        result: result
      })
    }
  })

}