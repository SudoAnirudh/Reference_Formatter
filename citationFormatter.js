// Citation formatting functions for different academic styles

export const formatCitation = (reference, format) => {
  if (!reference.type || !reference.title) return ''
  
  const authors = reference.authors.filter(a => a.trim()).join(', ')
  
  switch (format) {
    case 'ieee':
      return formatIEEE(reference, authors)
    case 'apa':
      return formatAPA(reference, authors)
    case 'mla':
      return formatMLA(reference, authors)
    case 'chicago':
      return formatChicago(reference, authors)
    case 'harvard':
      return formatHarvard(reference, authors)
    default:
      return ''
  }
}

const formatIEEE = (ref, authors) => {
  switch (ref.type) {
    case 'book':
      return `${authors}, "${ref.title}," ${ref.publisher}, ${ref.year}.`
    case 'journal':
      return `${authors}, "${ref.title}," ${ref.journal}, vol. ${ref.volume || 'X'}, no. ${ref.issue || 'X'}, pp. ${ref.pages || 'XX-XX'}, ${ref.year}.`
    case 'website':
      return `${authors}, "${ref.title}," ${ref.url}, ${ref.year}. [Online]. Available: ${ref.url}. [Accessed: ${ref.accessDate || 'Date'}].`
    case 'conference':
      return `${authors}, "${ref.title}," in Proc. ${ref.journal}, ${ref.year}, pp. ${ref.pages || 'XX-XX'}.`
    case 'thesis':
      return `${authors}, "${ref.title}," Ph.D. dissertation, ${ref.publisher}, ${ref.year}.`
    case 'report':
      return `${authors}, "${ref.title}," ${ref.publisher}, Tech. Rep. ${ref.volume || 'XXX'}, ${ref.year}.`
    default:
      return `${authors}, "${ref.title}," ${ref.journal || ref.publisher}, ${ref.year}.`
  }
}

const formatAPA = (ref, authors) => {
  switch (ref.type) {
    case 'book':
      return `${authors} (${ref.year}). ${ref.title}. ${ref.publisher}.`
    case 'journal':
      return `${authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}), ${ref.pages}.`
    case 'website':
      return `${authors} (${ref.year}). ${ref.title}. Retrieved from ${ref.url}`
    case 'conference':
      return `${authors} (${ref.year}). ${ref.title}. In Proceedings of ${ref.journal} (pp. ${ref.pages || 'XX-XX'}).`
    case 'thesis':
      return `${authors} (${ref.year}). ${ref.title} (Doctoral dissertation). ${ref.publisher}.`
    case 'report':
      return `${authors} (${ref.year}). ${ref.title} (Report No. ${ref.volume || 'XXX'}). ${ref.publisher}.`
    default:
      return `${authors} (${ref.year}). ${ref.title}. ${ref.journal || ref.publisher}.`
  }
}

const formatMLA = (ref, authors) => {
  switch (ref.type) {
    case 'book':
      return `${authors}. ${ref.title}. ${ref.publisher}, ${ref.year}.`
    case 'journal':
      return `${authors}. "${ref.title}." ${ref.journal}, vol. ${ref.volume}, no. ${ref.issue}, ${ref.year}, pp. ${ref.pages}.`
    case 'website':
      return `${authors}. "${ref.title}." ${ref.publisher || 'Web'}, ${ref.year}, ${ref.url}.`
    case 'conference':
      return `${authors}. "${ref.title}." ${ref.journal}, ${ref.year}, pp. ${ref.pages || 'XX-XX'}.`
    case 'thesis':
      return `${authors}. "${ref.title}." ${ref.year}. ${ref.publisher}, PhD dissertation.`
    case 'report':
      return `${authors}. "${ref.title}." ${ref.publisher}, ${ref.year}.`
    default:
      return `${authors}. "${ref.title}." ${ref.journal || ref.publisher}, ${ref.year}.`
  }
}

const formatChicago = (ref, authors) => {
  switch (ref.type) {
    case 'book':
      return `${authors}. ${ref.title}. ${ref.publisher}, ${ref.year}.`
    case 'journal':
      return `${authors}. "${ref.title}." ${ref.journal} ${ref.volume}, no. ${ref.issue} (${ref.year}): ${ref.pages}.`
    case 'website':
      return `${authors}. "${ref.title}." Accessed ${ref.accessDate || 'Date'}. ${ref.url}.`
    case 'conference':
      return `${authors}. "${ref.title}." Paper presented at ${ref.journal}, ${ref.year}.`
    case 'thesis':
      return `${authors}. "${ref.title}." PhD diss., ${ref.publisher}, ${ref.year}.`
    case 'report':
      return `${authors}. "${ref.title}." ${ref.publisher}, ${ref.year}.`
    default:
      return `${authors}. "${ref.title}." ${ref.journal || ref.publisher} (${ref.year}).`
  }
}

const formatHarvard = (ref, authors) => {
  switch (ref.type) {
    case 'book':
      return `${authors} ${ref.year}, ${ref.title}, ${ref.publisher}.`
    case 'journal':
      return `${authors} ${ref.year}, '${ref.title}', ${ref.journal}, vol. ${ref.volume}, no. ${ref.issue}, pp. ${ref.pages}.`
    case 'website':
      return `${authors} ${ref.year}, ${ref.title}, viewed ${ref.accessDate || 'Date'}, <${ref.url}>.`
    case 'conference':
      return `${authors} ${ref.year}, '${ref.title}', ${ref.journal}, pp. ${ref.pages || 'XX-XX'}.`
    case 'thesis':
      return `${authors} ${ref.year}, '${ref.title}', PhD thesis, ${ref.publisher}.`
    case 'report':
      return `${authors} ${ref.year}, ${ref.title}, ${ref.publisher}.`
    default:
      return `${authors} ${ref.year}, '${ref.title}', ${ref.journal || ref.publisher}.`
  }
}

