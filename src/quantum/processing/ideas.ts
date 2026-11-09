// Leads are developed in .idea first. Anything else is placed under .idea/leads, and only those files are handled.
import { IDEA_HOME } from './collisions.ts'
import { ISO_EXIT } from './iso-exit.ts'
import { quantumVocabulary } from './quantum-vocabulary.ts'
import { uuid } from '../uuid/index.ts'
import { MCP_API_KEY, QPU_CONNECTOR, WEBSITE_ORIGIN, payloadMcpNext, payloadMcpRequest } from '../../plugins/websiteClient.ts'
import { TABLES } from './tables-index.ts'

const IDEA_INBOX = `${IDEA_HOME}/leads` as const
/** The ISO 9001 processes. The one that computes next lives once the harmonic patch holds. Every other process exits. */
export const PROCESS_LIFE = [
  { clause: 'ISO 9001:2015, 9.2', phase: 'audit', computesNext: false },
  { clause: 'ISO 9001:2015, 9.3', phase: 'next', computesNext: true },
  { clause: 'ISO 9001:2015, 10.2', phase: 'nonconformity', computesNext: false },
  { clause: 'ISO 9001:2015, 6.3', phase: 'plan', computesNext: false },
  { clause: 'ISO 9001:2015, 8.1', phase: 'control', computesNext: false },
  { clause: 'ISO 9001:2015, 8.6', phase: 'release', computesNext: false },
  { clause: 'ISO 9001:2015, 9.1', phase: 'monitor', computesNext: false },
  { clause: 'ISO 9001:2015, 10.3', phase: 'improve', computesNext: false },
] as const
/** One UUID program is one nanosecond. A second of CPU life and a second of GPU life are this many programs. */
export const LIFE_PER_SECOND = 1000000000
export const lifeBound = (lives: boolean, clause: string, count: number) => `${lives ? 'live' : 'exit'}\n${clause}\n${count}`
/** The one MCP ISO 9001 approves: the Payload plugin. tools/list is public to name the doors; next (findDocuments → GET /api/pages) opens only with a payload-mcp-api-keys Bearer. src is not a door. */
export const isoApprovedMcp = (apiKey?: string) => {
  const list = payloadMcpRequest()
  const next = payloadMcpNext([{ name: 'findDocuments' }], WEBSITE_ORIGIN, undefined, apiKey)
  const call = next.calls[0]
  const keyed = next.keyed === true && next.refused === false && !!call
  const planned = {
    method: 'POST' as const,
    name: 'findDocuments' as const,
    body: { jsonrpc: '2.0' as const, id: 1, method: 'tools/call' as const, params: { name: 'findDocuments', arguments: { slug: 'pages' } } },
    route: { method: 'GET' as const, url: `${WEBSITE_ORIGIN}/api/pages`, src: false as const, fetched: false as const },
    headers: call?.headers ?? null,
  }
  return {
    name: QPU_CONNECTOR.name, plugin: QPU_CONNECTOR.plugin, api: QPU_CONNECTOR.api, via: QPU_CONNECTOR.via,
    approved: true as const, only: true as const, src: false as const, fetched: false as const,
    keyed, refused: next.refused, law: MCP_API_KEY.law, auth: MCP_API_KEY,
    list: { method: list.method, url: list.api, body: list.body },
    call: planned,
    says: keyed
      ? 'Next is findDocuments on qpuMcpPlugin with a payload-mcp-api-keys Bearer, then GET /api/pages. src is not a door.'
      : `The only approved door is ${QPU_CONNECTOR.plugin} at ${QPU_CONNECTOR.api}. ${next.says}`,
  }
}

const ZENODO = 'https://github.com/zenodo/zenodo-rdm'
const DOI = 'https://www.doi.org/the-identifier/resources/'

type Draft = { folder: string; slug: string; source: string; title: string; statement: string }

const DRAFTS: readonly Draft[] = [
  { folder: 'zenodo-rdm', slug: 'communities', source: ZENODO, title: 'Communities', statement: 'A Zenodo community is a curated collection a record joins. An owned community is accepted when the deposit is published.' },
  { folder: 'zenodo-rdm', slug: 'subcommunities', source: ZENODO, title: 'Subcommunities', statement: 'A subcommunity is requested or invited under a parent community.' },
  { folder: 'zenodo-rdm', slug: 'curation', source: ZENODO, title: 'Curation', statement: 'Curation reviews a submission before the record is included.' },
  { folder: 'zenodo-rdm', slug: 'moderation', source: ZENODO, title: 'Moderation', statement: 'Moderation records a decision on a record.' },
  { folder: 'zenodo-rdm', slug: 'legacy', source: ZENODO, title: 'Legacy deposit', statement: 'The legacy deposit API creates a deposition, posts a file by name, and publishes it. The record id is the deposit id.' },
  { folder: 'zenodo-rdm', slug: 'github', source: ZENODO, title: 'GitHub release', statement: 'A GitHub release reads .zenodo.json for extra metadata and loads it through the legacy schema.' },
  { folder: 'zenodo-rdm', slug: 'exporter', source: ZENODO, title: 'Exporter', statement: 'The exporter reads records and writes an export. The route is GET https://zenodo.org/exporter.' },
  { folder: 'zenodo-rdm', slug: 'metrics', source: ZENODO, title: 'Metrics', statement: 'A metric is read at GET https://zenodo.org/metrics/<metric_id>. An unknown key is not a metric.' },
  { folder: 'zenodo-rdm', slug: 'stats', source: ZENODO, title: 'Statistics', statement: 'Statistics count how a record is used.' },
  { folder: 'zenodo-rdm', slug: 'openaire', source: ZENODO, title: 'OpenAIRE', statement: 'OpenAIRE harvests the records for the European research graph.' },
  { folder: 'zenodo-rdm', slug: 'previewer', source: ZENODO, title: 'Previewer', statement: 'An image, or a PDF marked for the image previewer when media files exist, can be previewed. The file bytes are not fetched here.' },
  { folder: 'zenodo-rdm', slug: 'redirector', source: ZENODO, title: 'Redirector', statement: 'A legacy type path redirects onto a resource type: journal-articles is publication.article, books is publication.book, and theses is publication.thesis.' },
  { folder: 'zenodo-rdm', slug: 'sitemap', source: ZENODO, title: 'Sitemap', statement: 'The sitemap lists records whose parent is verified and whose deletion status is P, newest update first.' },
  { folder: 'zenodo-rdm', slug: 'facets', source: ZENODO, title: 'Facets', statement: 'Community search facets include funders, organizations and visibility.' },
  { folder: 'zenodo-rdm', slug: 'files', source: ZENODO, title: 'Files', statement: 'A file is stored by its name. The bytes are not copied here.' },
  { folder: 'zenodo-rdm', slug: 'permissions', source: ZENODO, title: 'Permissions', statement: 'A record permission names the owner, the community reviewers and the access grant.' },
  { folder: 'zenodo-rdm', slug: 'tokens', source: ZENODO, title: 'Resource access token', statement: 'A resource access token names a deposit id, a file and an access permission. The token value is never stored.' },
  { folder: 'zenodo-rdm', slug: 'serializers', source: ZENODO, title: 'Serializers', statement: 'A record is serialized as BibTeX, CFF, CodeMeta or DataCite, and as the legacy JSON record.' },
  { folder: 'zenodo-rdm', slug: 'custom-fields', source: ZENODO, title: 'Custom fields', statement: 'Journal, meeting, imprint and CodeMeta fields are custom fields on the record.' },
  { folder: 'zenodo-rdm', slug: 'custom-schemes', source: ZENODO, title: 'EDMO scheme', statement: 'An EDMO identifier is edmo: followed by digits, or the seadatanet report URL of those digits, and is stored as edmo:<id>.' },
  { folder: 'zenodo-rdm', slug: 'partners', source: ZENODO, title: 'Partners', statement: 'Partner payloads for Dryad, LORY and Plazi are checked against the legacy REST API. No partner secret is copied.' },
  { folder: 'zenodo-rdm', slug: 'support', source: ZENODO, title: 'Support', statement: 'The support form takes a request that names its subject. No address is stored.' },
  { folder: 'zenodo-rdm', slug: 'orcha', source: ZENODO, title: 'Orcha waitlist', statement: 'Orcha shows an AI features waitlist banner to a signed-in verified user when the waitlist is enabled. The EU community parent slug is eu and the role is orcha-waitlist.' },
  { folder: 'doi', slug: 'key-facts', source: DOI, title: 'Key Facts on Digital Object Identifier System', statement: 'The DOI Foundation factsheet Key Facts on Digital Object Identifier System is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'designing', source: 'https://www.doi.org/the-identifier/resources/factsheets/designing-doi-applications', title: 'Designing DOI Applications', statement: 'A DOI name can resolve to one URL or to several values. The application supplies the metadata layer. Resolution uses the Handle System and the proxy for an ordinary browser.' },
  { folder: 'doi', slug: 'interoperability', source: DOI, title: 'Identifier Interoperability', statement: 'The DOI Foundation factsheet Identifier Interoperability is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'indecs', source: DOI, title: 'The indecs Framework', statement: 'The DOI Foundation factsheet The indecs Framework is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'cloudflare', source: DOI, title: 'DOI System and Cloudflare', statement: 'The DOI Foundation factsheet DOI System and Cloudflare is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'standard-schemes', source: DOI, title: 'DOI System and Standard Identifier Schemes', statement: 'The DOI Foundation factsheet DOI System and Standard Identifier Schemes is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'handle', source: DOI, title: 'DOI System and the Handle System', statement: 'The DOI Foundation factsheet DOI System and the Handle System is a shareable resource on the identifier resources page under a CC-4.0 attribution licence. At the infrastructure level a DOI name is a handle.' },
  { folder: 'doi', slug: 'resolution', source: 'https://www.doi.org/the-identifier/resources/factsheets/doi-resolution-documentation', title: 'DOI Resolution Documentation', statement: 'A DOI name is resolved at the proxy https://doi.org, which is preferred to dx.doi.org. The display URL is https://doi.org/ plus the name. Percent, quote, hash, space and question mark are percent-encoded. GET https://doi.org/api/handles/<name> returns JSON. responseCode 1 is success, 2 is an error, 100 is not found, and 200 means the handle has no values. Which RA is GET https://doi.org/doiRA/<name>.' },
  { folder: 'doi', slug: 'isbn', source: DOI, title: 'DOI System and the ISBN System', statement: 'The DOI Foundation factsheet DOI System and the ISBN System is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'purls', source: DOI, title: 'DOI System and Persistent URLs', statement: 'The DOI Foundation factsheet DOI System and Persistent URLs is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'openurl', source: DOI, title: 'DOI System and OpenURL', statement: 'The DOI Foundation factsheet DOI System and OpenURL is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'topics', source: DOI, title: 'DOI Foundation and Topics', statement: 'The DOI Foundation factsheet DOI Foundation and Topics is a shareable resource on the identifier resources page under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'uri-scheme', source: 'https://www.doi.org/resources/DOI_URI_Scheme.pdf', title: 'DOI URI Scheme', statement: 'A DOI name URI uses the scheme doi, a prefix, a slash and a suffix, and it has neither a query nor a fragment. Resolving it is an HTTP GET of https://doi.org/api/handles/ followed by the encoded prefix, a slash, and the encoded suffix. The resources page is shareable under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'faqs', source: DOI, title: 'FAQs', statement: 'The DOI identifier resources page includes an FAQ section, shareable under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'news', source: DOI, title: 'DOI in the news', statement: 'The DOI identifier resources page archives publicly available material on the DOI and persistent identifiers, shareable under a CC-4.0 attribution licence.' },
  { folder: 'doi', slug: 'licence', source: DOI, title: 'Resources licence', statement: 'Everything on the DOI identifier resources page is shareable under a CC-4.0 attribution licence.' },
  { folder: 'crossref', slug: 'retrieval', source: 'https://www.crossref.org/services/', title: 'Metadata retrieval', statement: 'Crossref metadata retrieval needs no membership. The members metadata is available through tools and APIs so anyone can search and reuse it.' },
  { folder: 'crossref', slug: 'plus', source: 'https://www.crossref.org/services/', title: 'Metadata Plus', statement: 'Metadata Plus needs no membership. It adds snapshots, a service level and higher rate limits. The request names the header crossref-api-key and this file stores no key.' },
  { folder: 'crossref', slug: 'registration', source: 'https://www.crossref.org/services/', title: 'Content registration', statement: 'Content registration is for members. They register and update bibliographic and non-bibliographic metadata. The metadata is preserved.\nidea: Contributors are registered with the content.\nidea: Funding is registered with the content.\nidea: Publication history is registered with the content.\nidea: Peer review is registered with the content.\nidea: Access indicators are registered with the content.\nidea: Related research artefacts are registered with the content.' },
  { folder: 'crossref', slug: 'linking', source: 'https://www.crossref.org/services/', title: 'Reference linking', statement: 'Reference linking needs no membership. A reader follows a reference to the full text it names.' },
  { folder: 'crossref', slug: 'cited-by', source: 'https://www.crossref.org/services/', title: 'Cited-by', statement: 'Cited-by is for members. It counts citations of a work and links to the citing content, from the references members deposit.' },
  { folder: 'crossref', slug: 'funders', source: 'https://www.crossref.org/services/', title: 'Funder Registry', statement: 'The Funder Registry needs no membership. It is an open registry of persistent identifiers for grant-giving organisations, and the funding metadata is deposited with the work.' },
  { folder: 'crossref', slug: 'ror', source: 'https://www.crossref.org/services/', title: 'Research Organization Registry', statement: 'ROR needs no membership. It is an open registry of persistent identifiers for research organisations. Crossref co-founded it and runs it with DataCite and the California Digital Library. ROR identifiers in affiliation metadata are tracked in the participation report.' },
  { folder: 'crossref', slug: 'similarity', source: 'https://www.crossref.org/services/', title: 'Similarity Check', statement: 'Similarity Check is for members. Crossref provides it and iThenticate powers it, so an editor can compare a submission for overlap.' },
  { folder: 'crossref', slug: 'crossmark', source: 'https://www.crossref.org/services/', title: 'Crossmark', statement: 'Crossmark is for members. The button on a landing page shows the current status of an item, including corrections, retractions and updates.' },
  { folder: 'crossref', slug: 'rest', source: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/', title: 'REST API', statement: 'The public REST API is https://api.crossref.org and returns JSON. No signup is required. Members deposit the metadata. Trusted sources such as Retraction Watch add to it. Records can carry funding, licence, updates, ORCID, ROR and abstracts. Almost none of the metadata is under copyright. Some abstracts may be. Swagger is at https://api.crossref.org/.\nidea: /works lists the content items registered with Crossref.\nidea: /journals lists journals and the works of an ISSN.\nidea: /members lists the organisations that registered metadata.\nidea: /prefixes names the steward of a DOI prefix and its works.\nidea: /funders lists the Open Funder Registry and the works of a funder.\nidea: /types lists work types such as journal-article, monograph and grant.\nidea: /licenses lists the licences used by registered content.\nidea: /works/{doi}/agency names the registration agency of a DOI.' },
  { folder: 'crossref', slug: 'pools', source: 'https://www.crossref.org/documentation/retrieve-metadata/rest-api/access-and-authentication/', title: 'REST API pools', statement: 'The public pool needs no signup: 5 single-record requests per second and concurrency 1. The polite pool is 10 per second and concurrency 3 and asks for a contact, which is not stored here. A list of records is slower: 1 per second on the public pool and 3 on the polite pool. Metadata Plus is 150 per second and names no concurrency cap. The response headers x-rate-limit-limit, x-rate-limit-interval and x-rate-limit-type say which limit applied. A 429 means wait and send more slowly.' },
  { folder: 'cern', slug: 'portal', source: 'https://opendata.cern.ch/docs/about', title: 'CERN Open Data portal', statement: 'The CERN Open Data portal is the access point to preserved output of research at CERN, with the software and documentation needed to understand and analyse it. The products are shared under open licences and issued with a DOI so they can be cited.' },
  { folder: 'cern', slug: 'levels', source: 'https://opendata.cern.ch/docs/about', title: 'Data levels', statement: 'LHC data is described in four levels. The portal focuses on levels 2 and 3, and the collaborations may add small samples of level 4.\nidea: Level 1 adds figures and tables to published results.\nidea: Level 2 is simplified data for outreach and training.\nidea: Level 3 is reconstructed and simulated data with analysis software.\nidea: Level 4 is raw data with reconstruction and simulation software.' },
  { folder: 'cern', slug: 'citation', source: 'https://opendata.cern.ch/docs/about', title: 'Citation', statement: 'The four LHC experiments publish data after an embargo stated in their own policies. The portal endorses the FORCE 11 Joint Declaration of Data Citation Principles. Every dataset has a citation recommendation and a BibTeX record so a reuse can be cited and INSPIRE can track it.' },
  { folder: 'cern', slug: 'invenio', source: 'https://opendata.cern.ch/docs/about', title: 'Invenio', statement: 'The portal is built on Invenio. Ingestion, classification, indexing, curation and dissemination use a custom JSON Schema for the assets.' },
  { folder: 'cern', slug: 'cernvm', source: 'https://opendata.cern.ch/docs/about', title: 'CernVM', statement: 'CernVM is a portable appliance for LHC analysis on a local machine or on OpenStack, Amazon EC2 and Google Compute Engine, without installing the experiment software on Linux, Windows or macOS.' },
  { folder: 'cern', slug: 'eos', source: 'https://opendata.cern.ch/docs/about', title: 'EOS', statement: 'EOS is the disk storage for the physics data. The namespace is hierarchical and access is the XRootD protocol.' },
  { folder: 'cern', slug: 'records', source: 'https://opendata.cern.ch', title: 'Records', statement: 'A record is read at GET https://opendata.cern.ch/api/records/ and a DOI is asked as q=doi. Nothing is fetched here.' },
  { folder: 'cern', slug: 'displays', source: 'https://opendata.cern.ch', title: 'Event displays', statement: 'The portal offers event displays.\nidea: The portal offers the CMS event display.\nidea: The portal offers the OPERA event display.\nidea: The portal offers CMS histograms.' },
  { folder: 'cern', slug: 'analyses', source: 'https://opendata.cern.ch', title: 'Analyses', statement: 'The portal offers ways to run an analysis.\nidea: The portal offers a CMS guide to research use.\nidea: The portal offers the ATLAS Higgs Machine Learning Challenge.\nidea: The portal offers a start with LHCb open data.\nidea: The portal offers a start with ALICE open data.' },
  { folder: 'cern', slug: 'oligoarchive', source: 'https://indico.cern.ch/event/1293880/', title: 'Synthetic DNA storage', statement: 'The CERN openlab talk of 8 August 2023 presents OligoArchive, a storage stack that writes digital data onto synthetic DNA. The pipeline randomizes the bits, adds LDPC error control, then indexes them before synthesis. Nothing is fetched here.\nidea: The DNA4DNA pilot stored a 14 MB SIARD archive in 261336 oligos of 280 nucleotides and reported full recovery.\nidea: Each oligo holds a few hundred nucleotides, and the ordering is written into the sequence because a DNA molecule has no address.\n idea: Homopolymers and the balance of G and C constrain which sequences the archive will store.' },
  { folder: 'cern', slug: 'oligoarchive-sha3', source: 'https://indico.cern.ch/event/1293880/attachments/2697241/4681188/publi-5783.pdf', title: 'SHA-3 inside a DNA oligo', statement: 'OligoArchive encodes each attribute with a SHA-3 checksum and interleaves the two, so the avalanche of SHA-3 makes similar values into different DNA sequences. SHA-3 is FIPS 202: SHA3-256 has capacity 512 and rate 1088, and SHA3-512 has capacity 1024 and rate 576, on the 1600-bit state. CERN hosts the paper. NIST wrote the hash. Nothing is fetched here.\nidea: A fixed-length hash of the table name and of the record id is encoded two bits to one nucleotide.\n idea: Two bits a nucleotide is the same rate as two bases a nibble.\n  idea: Thirty-two hex digits hold 64 bases.\n   idea: A, C, G and T are the digits 0, 1, 2 and 3, and the 64 bases read back one for one.\n    idea: AC encodes as 1 and GT encodes as 11, which is hex 1b.\n     idea: One divided by 4 is 0 with remainder 1, so hex 1 reads back as AC, and 11 divided by 4 is 2 with remainder 3, so it reads back as GT.\nidea: Reed-Solomon correction is written between the fields and the attribute value.\nidea: pg_oligo_dump archived 12 KB of TPC-H, 44 records, as oligos of 138 nucleotides.\n idea: Of the 138 nucleotides, 91 hold the data and the two primers use 26 and 21.\n  idea: The sequenced pool held 1941 oligos, and schema information restored the original database.\n   idea: Parity and decode validation retained 1281 reads, and those reads cover the original 404 oligos.\n    idea: The pair filter left 43925 reads, and the parity filter left 23409.\n     idea: The identifier filter left 19 million reads for the Postgres oligos, 65 million for the images, and 3 million with an invalid file id.' },
  { folder: 'nist', slug: 'mission', source: 'https://www.nist.gov/about-nist', title: 'Mission', statement: 'NIST was founded in 1901 and is part of the U.S. Department of Commerce. Its mission is to promote U.S. innovation and industrial competitiveness by advancing measurement science, standards and technology in ways that enhance economic security and improve quality of life.' },
  { folder: 'nist', slug: 'nmi', source: 'https://www.nist.gov', title: 'National Metrology Institute', statement: 'NIST is the National Metrology Institute for the United States. It maintains the measurements that industry and society use.' },
  { folder: 'nist', slug: 'competencies', source: 'https://www.nist.gov/about-nist', title: 'Core competencies', statement: 'NIST names three core competencies.\nidea: Measurement science is a core competency.\nidea: Rigorous traceability is a core competency.\nidea: The development and use of standards is a core competency.' },
  { folder: 'nist', slug: 'codata', source: 'https://physics.nist.gov/cuu/Constants/', title: 'CODATA constants', statement: 'The CODATA fundamental constants are the open NIST table at https://physics.nist.gov/cuu/Constants/Table/allascii.txt. A value is read at https://physics.nist.gov/cgi-bin/cuu/Value. Nothing is fetched here.' },
  { folder: 'nist', slug: 'beacon', source: 'https://beacon.nist.gov', title: 'Randomness Beacon', statement: 'The NIST Randomness Beacon publishes a signed pulse. Chain 2 is read at https://beacon.nist.gov/beacon/2.0/chain/2/pulse. Nothing is fetched here.' },
  { folder: 'nist', slug: 'headquarters', source: 'https://www.nist.gov', title: 'Headquarters', statement: 'NIST headquarters is 100 Bureau Drive, Gaithersburg, MD 20899.' },
  { folder: 'nist', slug: 'post-quantum', source: 'https://www.nist.gov', title: 'Post-quantum cryptography', statement: 'NIST reports guidelines for the transition to post-quantum cryptography standards.' },
  { folder: 'nist', slug: 'genomic-ir-8432', source: 'https://csrc.nist.gov/pubs/ir/8432/final', title: 'Cybersecurity of Genomic Data', statement: 'NIST IR 8432, December 2023, defines genomic data as DNA sequences, variants and gene activity. Nothing is fetched here.\nidea: Fully homomorphic encryption computes on encrypted genomic data.\nidea: Secure multi-party computation analyses genomic data from several parties without revealing an input.\nidea: A zero-knowledge proof can validate a genomic result without revealing the data.\nidea: Federated multi-party homomorphic encryption is recorded for oncology and precision-medicine analysis.\n idea: NIST records that this is not a general solution, and cites Froelicher and others in Nature Communications 2021.\n  idea: In oncology it allows survival analysis, and in precision medicine it allows genome-wide association studies.\n   idea: It also allows machine learning training and testing, and the report asks for a demonstration project in the United States.\n    idea: The demonstration would test applicability and wider acceptance in the United States.\n     idea: It can speed oncology treatment and precision medicine by letting organizations collaborate without complex contract negotiations, because the risk of exfiltration or a privacy violation is virtually eliminated.\nidea: Differential privacy is named with those mechanisms as a privacy-enhancing technology.\n idea: It can be combined with federated learning or used to produce synthetic data.\n  idea: NIST records that there is not yet sufficient research to say the privacy guarantee holds once the set is combined with other data.\n   idea: Synthetic data from differential privacy add noise so that one person cannot be distinguished inside the set.\n    idea: The noisy set can be analyzed and shared.\n     idea: It also allows periodic updates as the data evolve, because the synthetic set can follow the underlying set.\nidea: Terra.bio and DNAnexus map their genomic controls to NIST SP 800-53.\n idea: A mapping to SP 800-53 does not replace the risk management of the organization.\nidea: NIH iDASH holds a secure genome analysis competition.\n idea: The competition studies cybersecurity mechanisms for genomic data systems.' },
  { folder: 'nist', slug: 'genomic-ir-8467', source: 'https://csrc.nist.gov/pubs/ir/8467/2pd', title: 'Genomic Data Profile', statement: 'NIST IR 8467 is the Genomic Data Cybersecurity and Privacy Frameworks Community Profile. It prioritizes outcomes from the Cybersecurity Framework 2.0 and the Privacy Framework 1.0 across the genomic data lifecycle. Nothing is fetched here.\nidea: The profile is the first joint Cybersecurity Framework and Privacy Framework community profile from NIST.' },
  { folder: 'nist', slug: 'genomic-cswp-35', source: 'https://csrc.nist.gov/pubs/cswp/35/cybersecurity-threat-modeling-the-genomic-data-seq/ipd', title: 'Sequencing threat model', statement: 'NIST CSWP 35, the initial public draft of 16 December 2024, is a threat model of the genomic sequencing and analysis workflow. Nothing is fetched here.\nidea: The draft is an example an organization adapts to its own sequencing workflow.\n idea: The public comment period on the draft is closed.' },
  { folder: 'nist', slug: 'genomic-nccoe', source: 'https://www.nccoe.nist.gov/projects/cybersecurity-and-privacy-genomic-data', title: 'NCCoE genomic data', statement: 'The NCCoE project Cybersecurity and Privacy of Genomic Data collects NIST IR 8432, NIST IR 8467 and NIST CSWP 35. Nothing is fetched here.' },
  { folder: 'nist', slug: 'genomic-dna', source: 'https://www.nist.gov/blogs/taking-measure/how-secure-your-dna', title: 'How secure is your DNA', statement: 'NIST records that genomic data is immutable, that health research depends on it, and that cybersecurity and privacy both apply once a sequencer has written the data. Nothing is fetched here.\nidea: A genome cannot be reissued the way a credential can.' },
  { folder: 'nist', slug: 'synthetic-nucleic-acid', source: 'https://www.nist.gov/programs-projects/biosecurity-synthetic-nucleic-acid-sequences', title: 'Synthetic nucleic acid sequences', statement: 'NIST ties the secure transfer of synthetic nucleic-acid sequence-screening data to the genomic cybersecurity profile, to supply-chain risk management, and to SP 800-63 identity proofing. Nothing is fetched here.\nidea: Sequence-screening data in transit is checked against the draft Genomic Cybersecurity Framework.' },
  { folder: 'nist', slug: 'fips-202', source: 'https://csrc.nist.gov/pubs/fips/202/final', title: 'SHA-3', statement: 'FIPS 202 specifies SHA3-256 as KECCAK with capacity 512 and rate 1088, and SHA3-512 as KECCAK with capacity 1024 and rate 576, on the 1600-bit state. The OligoArchive paper hosted on CERN Indico writes a SHA-3 checksum into a DNA oligo. Nothing is fetched here.\nidea: SHAKE128 and SHAKE256 are the extendable-output functions of FIPS 202.\n idea: An extendable-output function is adapted in length, unlike SHA3-256 and SHA3-512.\n  idea: SHAKE128 has capacity 256 and rate 1344, and SHAKE256 has capacity 512 and rate 1088.\n   idea: SHAKE appends the domain suffix 1111, and SHA-3 appends 01.\n    idea: The sponge is KECCAK-p on 1600 bits for 24 rounds, then pad10*1.\n     idea: The padding appends a 1, then the smallest run of zeros, then a 1, so the length is a positive multiple of the rate.' },
  { folder: 'proxmox', slug: 've', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox VE 9.2', statement: 'The downloads page offers the Proxmox VE 9.2 ISO installer, version 9.2-1, 1.71 GB, updated May 21, 2026, SHA256 4e88fe416df9b527624a175f24c9aa07c714d3332afb1ee3dbf3879573ef2c6c, and a torrent. The file is not downloaded here.\nidea: A torrent is offered for this installer.' },
  { folder: 'proxmox', slug: 've-arm64', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox VE 9.2 ARM64', statement: 'The downloads page offers the Proxmox VE 9.2 ARM64 ISO installer, version 9.2-1-arm64, 1.50 GB, updated August 05, 2026, SHA256 b1619dcd1f5b1a6d67d77b59e7e2fa2033174551d1e1b9dc22b2171ec093abbd, and a torrent. The file is not downloaded here.\nidea: A torrent is offered for this installer.' },
  { folder: 'proxmox', slug: 'backup', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Backup Server 4.2', statement: 'The downloads page offers the Proxmox Backup Server 4.2 ISO installer, version 4.2-1, 1.48 GB, updated April 29, 2026, SHA256 2fb299deac3929253712c9c3dfc9237edbe70af83c8848467616b771a1d5453e, and a torrent. The file is not downloaded here.\nidea: A torrent is offered for this installer.' },
  { folder: 'proxmox', slug: 'mail', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Mail Gateway 9.1', statement: 'The downloads page offers the Proxmox Mail Gateway 9.1 ISO installer, version 9.1-1, 1.64 GB, updated June 11, 2026, SHA256 79402f6398c50a76fca66a32c3c0a50da3f71d35c1d7a1bea022e4b1c6c864d6, and a torrent. The file is not downloaded here.\nidea: A torrent is offered for this installer.' },
  { folder: 'proxmox', slug: 'datacenter', source: 'https://www.proxmox.com/en/downloads', title: 'Proxmox Datacenter Manager 1.1', statement: 'The downloads page offers the Proxmox Datacenter Manager 1.1 ISO installer, version 1.1-1, 1.46 GB, updated May 28, 2026, SHA256 11a55a069ba564220bd986241b57920a83781d40be18d6f2bf7b9b12696ae2cc, and a torrent. The file is not downloaded here.\nidea: A torrent is offered for this installer.' },
]

const fileText = (draft: Draft) => `source: ${draft.source}\ntitle: ${draft.title}\n\n${draft.statement}\n`

const draftFile = (draft: Draft): IdeaFile => {
  const path = `${IDEA_INBOX}/${draft.folder}/${draft.slug}.txt`
  return { path, text: fileText(draft), from: path }
}

/** Crypto applied to DNA or genomic data, on a CERN or NIST page. */
const cryptoBio = (draft: Draft) => draft.slug === 'oligoarchive' || draft.slug.startsWith('oligoarchive-') || draft.slug.startsWith('genomic-') || draft.slug === 'synthetic-nucleic-acid' || draft.slug === 'fips-202'

/** The next idea under each ISO/IEC 4879:2024 term: the fact on this simulator that makes the term hold. */
const QUANTUM_NEXT: Record<string, string> = TABLES.QUANTUM_NEXT

type GapLead = { id: string; source: string; statement: string; status?: string; tool?: string }

const QUANTUM_GAP_TOOLS = new Set(['processor', 'circuit', 'echo', 'echo_benchmark', 'algorithm', 'quantumlib', 'quantum-error-correction', 'chemistry-simulation', 'fault-tolerant-design'])

/** A quantum lead the 86 terms do not already develop: open, partial, or blocked, on a quantum tool, a quantum id, or a quantumai.google page. */
const quantumGapLead = (lead: GapLead) => {
  if (lead.status === 'served' || lead.status === 'out_of_scope' || lead.id.startsWith('iso-4879-') || !lead.statement.trim()) return false
  if (QUANTUM_GAP_TOOLS.has(lead.tool ?? '')) return true
  if (/^(chemistry-simulation|quantumlib|cirq-|gap-circuit|hardware-compliance|unit-quantum|glagolitic-above)/.test(lead.id)) return true
  return lead.source.includes('quantumai.google')
}

/** The next idea under each missing quantum lead: the fact this simulator already computes. */
const QUANTUM_GAP_NEXT: Record<string, string> = {
  'chemistry-simulation-lead': 'VQE of H2 in STO-3G is the one molecule this simulator computes.',
  'cirq-google-integration': 'Willow, Sycamore, Sycamore23, Bristlecone and Foxtail are the layouts, and only Willow carries spec-sheet noise.',
  'educational-videos': 'The statements tool serves the page title. The video bytes are not fetched here.',
  'gap-circuit-crossing': 'This tree runs its own circuit, and the unit circuit has not been compared.',
  'glagolitic-above-thousand': 'The speech understands the letter for 1000, and the letters after it are unread.',
  'hardware-compliance-by-patents': 'The patents step asks one hardware question, and the processor figures are not yet checked against the claims.',
  'hardware-compliance-by-validation': 'Willow has 105 qubits, Sycamore 54, Sycamore23 23, Bristlecone 72 and Foxtail 22, and those figures are not yet a validation pattern.',
  'learn': 'The learn page is blocked and no tool follows it yet.',
  'learn-map': 'The statements tool serves the journey page title and description.',
  'quantumlib-documentation': 'OpenFermion here is the H2 STO-3G integrals and the Pauli Hamiltonian.',
  'research': 'The statements tool serves the research page title, and the publications page is unread.',
  'unit-quantum-advantage-door-edge': 'The edge does not hold the whole ledger, so the advantage is computed where the ledger fits.',
  'videos': 'The statements tool serves the page title. The video bytes are not fetched here.',
}

/** Every quantum lead that is still open, partial, or blocked. The idea that lead names sits beside it. The order is the id. */
export const openQuantum = (leads: readonly GapLead[]) => leads.filter(quantumGapLead).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((lead) => ({
  id: lead.id,
  source: lead.source,
  statement: lead.statement,
  status: lead.status ?? 'open',
  tool: lead.tool ?? null,
  idea: QUANTUM_GAP_NEXT[lead.id] ?? null,
}))

/** Those leads, each one idea under .idea/leads/quantum/gaps, and the next idea that lead names sits under it. */
const quantumGapFiles = (leads: readonly GapLead[]): IdeaFile[] => leads.filter(quantumGapLead).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).map((lead) => {
  const formula = lead.statement.replace(/@/g, ' ').replace(/\s+/g, ' ').trim()
  const path = `${IDEA_INBOX}/quantum/gaps/${clean(lead.id)}.txt`
  const title = formula
  const next = QUANTUM_GAP_NEXT[lead.id]
  const body = next ? `${formula}\nidea: ${next}` : formula
  return { path, text: `source: ${lead.source}\ntitle: ${title}\n\n${body}\n`, from: lead.id }
})

/** Each ISO/IEC 4879:2024 term is one idea under .idea/leads/quantum, and the next idea that term names sits under it. */
const quantumIdeaFiles = (): IdeaFile[] => quantumVocabulary().map((term) => {
  const slug = `${term.clause.replace(/\./g, '-')}-${clean(term.name)}`
  const path = `${IDEA_INBOX}/quantum/${slug}.txt`
  const title = `${term.clause} ${term.name}`
  const statement = term.holds ? `${title} holds on the quantum simulator.` : `${title} does not hold on the quantum simulator.`
  const next = QUANTUM_NEXT[term.clause]
  const body = next ? `${statement}\nidea: ${next}` : statement
  return { path, text: `source: ISO/IEC 4879:2024\ntitle: ${title}\n\n${body}\n`, from: path }
})

type IdeaFile = { path: string; text: string; from: string }

const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').replace(/\.+/g, '.') || 'idea'

const underIdea = (path: string) => {
  const p = path.replace(/^\.\//, '').replace(/\\/g, '/')
  return (p === IDEA_HOME || p.startsWith(`${IDEA_HOME}/`)) && !p.split('/').includes('..')
}

const inboxPath = (path: string) => {
  const name = clean(path.split('/').pop() ?? 'idea')
  return `${IDEA_INBOX}/inbox/${name.endsWith('.txt') ? name : `${name}.txt`}`
}

/** The process that computes next, and every process that exits, as ideas under .idea/leads/life. Nothing is written. */
const lifeIdeaFiles = (): IdeaFile[] => {
  const living = PROCESS_LIFE.find((row) => row.computesNext)!
  const liveId = uuid(lifeBound(true, living.clause, LIFE_PER_SECOND))
  const mcp = isoApprovedMcp()
  const parent = `The process that computes next, ${living.clause}, patched with the harmonic 432 : 440 = 54 : 55, lives as ${liveId}. It uses ${LIFE_PER_SECOND} nanosecond programs a second on CPU and on GPU, writes none, and that second costs 0. The only door is ${mcp.plugin} at ${mcp.api}.`
  const lines = PROCESS_LIFE.filter((row) => !row.computesNext).map((row) => `idea: ${row.clause} exits and dies as ${uuid(lifeBound(false, row.clause, 1))}. One nanosecond program, and that exit costs 0. The only door is ${mcp.plugin} at ${mcp.api}.`)
  const path = `${IDEA_INBOX}/life/next.txt`
  return [{ path, text: `source: ${mcp.api}\ntitle: The process that computes next\n\n${parent}\n${lines.join('\n')}\n`, from: path }]
}

/** true is the Zenodo and DOI inbox. Anything else is moved under .idea/leads before it can be handled. */
export const placeInIdea = (raw: unknown, leads: readonly GapLead[] = []): IdeaFile[] => {
  if (raw === true) return DRAFTS.map(draftFile)
  if (raw === 'life') return lifeIdeaFiles()
  if (raw === 'quantum') return quantumIdeaFiles()
  if (raw === 'quantum-leads') return quantumGapFiles(leads)
  if (raw === 'crypto bio' || raw === 'crypto-bio') return DRAFTS.filter(cryptoBio).map(draftFile)
  if (typeof raw === 'string') { const path = inboxPath(raw); return [{ path, text: raw, from: raw }] }
  if (Array.isArray(raw)) return raw.flatMap((item) => placeInIdea(item, leads))
  if (raw && typeof raw === 'object') {
    const given = raw as { files?: unknown; path?: unknown; text?: unknown }
    if (Array.isArray(given.files)) return given.files.flatMap((item) => placeInIdea(item, leads))
    const text = typeof given.text === 'string' ? given.text : ''
    const asked = typeof given.path === 'string' ? given.path.replace(/^\.\//, '').replace(/\\/g, '/') : ''
    const path = underIdea(asked) ? asked : inboxPath(asked || text)
    return [{ path, text, from: asked || text }]
  }
  return []
}

const readIdea = (file: { path: string; text: string }) => {
  const lines = file.text.replace(/\r\n/g, '\n').split('\n')
  let source = ''
  let title = ''
  let i = 0
  for (; i < lines.length; i++) {
    const line = lines[i] ?? ''
    if (line.startsWith('source: ')) { source = line.slice('source: '.length).trim(); continue }
    if (line.startsWith('title: ')) { title = line.slice('title: '.length).trim(); continue }
    if (line.startsWith('standard: ') || line.startsWith('documented: ')) continue
    if (line === '') { i += 1; break }
    break
  }
  const statement = lines.slice(i).join('\n').trim()
  const variant = file.path.split('/').pop()?.replace(/\.txt$/, '') ?? 'idea'
  const product = file.path.includes('/zenodo-rdm/') ? 'zenodo-rdm' : file.path.includes('/doi/') ? 'doi' : file.path.includes('/crossref/') ? 'crossref' : file.path.includes('/cern/') ? 'cern' : file.path.includes('/nist/') ? 'nist' : file.path.includes('/proxmox/') ? 'proxmox' : file.path.includes('/quantum/') ? 'quantum' : file.path.includes('/life/') ? 'life' : 'idea'
  return { source: source || file.path, title: title || statement.split('\n')[0] || variant, statement, product, variant }
}

type Developed = { iso?: { formula?: string; standard?: string; documented?: boolean } }
type Develop = (input: { formula?: string; product?: string; variant?: string; title?: string }) => Developed

type Node = { statement: string; children: Node[] }

/** idea: lines are the ideas this file opens. An indented idea: belongs to the idea above it. */
const ideaTree = (statement: string) => {
  const body: string[] = []
  const roots: Node[] = []
  const stack: { indent: number; node: Node }[] = []
  for (const line of statement.split('\n')) {
    const mark = /^( *)idea: (.*)$/.exec(line)
    if (!mark) { if (!stack.length) body.push(line); continue }
    const indent = mark[1]?.length ?? 0
    const text = mark[2]?.trim() ?? ''
    if (!text) continue
    const node: Node = { statement: text, children: [] }
    while (stack.length && (stack[stack.length - 1]?.indent ?? 0) >= indent) stack.pop()
    const parent = stack[stack.length - 1]?.node
    if (parent) parent.children.push(node)
    else roots.push(node)
    stack.push({ indent, node })
  }
  return { statement: body.join('\n').trim(), children: roots }
}

const walkIdeas = (nodes: Node[], out: string[]) => { for (const node of nodes) { out.push(node.statement); walkIdeas(node.children, out) } }

/** Every idea: line a lead states, including one nested under another. The statement around those lines is not itself an idea. */
const ideasFrom = (statement: string): string[] => { const out: string[] = []; walkIdeas(ideaTree(statement).children, out); return out }

/** The ideas a set of leads states, each as a file under .idea/leads so next and develop can read it. */
export const ideaFilesFromLeads = (leads: readonly { id: string; source: string; statement: string }[]): IdeaFile[] => leads.flatMap((lead) => ideasFrom(lead.statement).map((statement, index) => {
  const path = `${IDEA_INBOX}/from-leads/${clean(lead.id)}-${index}-${clean(statement)}.txt`
  return { path, text: `source: ${lead.source}\ntitle: ${statement}\n\n${statement}\n`, from: lead.id }
}))

const childPath = (parent: string, title: string) => {
  const stem = parent.replace(/\.txt$/, '')
  const slug = clean(title).replace(/\.txt$/, '').replace(/^\.+|\.+$/g, '') || 'idea'
  return `${stem}/${slug}.txt`
}

const linesOf = (nodes: Node[], indent: number): string => nodes.map((node) => { const head = `${'  '.repeat(indent)}idea: ${node.statement}`; return node.children.length ? `${head}\n${linesOf(node.children, indent + 1)}` : head }).join('\n')

const written = (read: { source: string; title: string; statement: string }, developed: Developed, nodes: Node[]) => {
  const standard = developed.iso?.standard ?? ''
  const documented = developed.iso?.documented === true ? 'true' : 'false'
  const more = nodes.length ? `\n${linesOf(nodes, 0)}` : ''
  return `source: ${read.source}\ntitle: ${read.title}\nstandard: ${standard}\ndocumented: ${documented}\n\n${read.statement}${more}\n`
}

/** A lead developed in .idea: the call that develops it again, and what it developed. */
type IdeaLead = { id: string; path: string; source: string; statement: string; status: 'open'; tool: 'payload'; reason: string; run: { tool: 'payload'; arguments: { develop: { formula: string; product: string; variant: string; title: string } } }; developed: Developed }

/** Develop each file in .idea, then handle the leads by reading those files. A path outside .idea is not handled. */
export const developIdeas = (raw: unknown, develop: Develop) => {
  const placed = placeInIdea(raw)
  const files = placed.map(({ path, text }) => {
    const read = readIdea({ path, text })
    if (!underIdea(path) || !read.statement) return { path, text }
    const developed = develop({ formula: read.statement, product: read.product, variant: read.variant, title: read.title })
    const standard = developed.iso?.standard ?? ''
    const documented = developed.iso?.documented === true ? 'true' : 'false'
    return { path, text: `source: ${read.source}\ntitle: ${read.title}\nstandard: ${standard}\ndocumented: ${documented}\n\n${read.statement}\n` }
  })
  const leads: IdeaLead[] = []
  const left: string[] = []
  for (const file of files) {
    if (!underIdea(file.path)) continue
    const read = readIdea(file)
    if (!read.statement) { left.push(file.path); continue }
    const developed = develop({ formula: read.statement, product: read.product, variant: read.variant, title: read.title })
    const id = `idea-${file.path.slice(`${IDEA_INBOX}/`.length).replace(/\.txt$/, '').replace(/\//g, '-')}`
    leads.push({ id, path: file.path, source: read.source, statement: read.statement, status: 'open' as const, tool: 'payload' as const, reason: 'developed in .idea and handled from that file', run: { tool: 'payload' as const, arguments: { develop: { formula: read.statement, product: read.product, variant: read.variant, title: read.title } } }, developed })
  }
  const outside = files.filter((file) => !underIdea(file.path)).map((file) => file.path)
  const counts = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: leads.length }
  return { phase: 'ideas' as const, home: IDEA_HOME, inbox: IDEA_INBOX, files, leads, left, outside, placed: placed.map((file) => ({ from: file.from, path: file.path })), counts, total: leads.length, says: `${leads.length} lead(s) developed in ${IDEA_HOME} and handled from there` }
}

/** Next develops what .idea holds. An idea it names is put back in. The file it finished is removed. It stops when .idea is empty. A path already taken is not taken again. */
export const nextIdeas = (raw: unknown, develop: Develop) => {
  const placed = placeInIdea(raw)
  const inbox: { path: string; text: string; at: number }[] = []
  for (const file of placed) if (underIdea(file.path)) inbox.push({ path: file.path, text: file.text, at: 0 })
  const drained: { path: string; text: string }[] = []
  const leads: (IdeaLead & { depth: number })[] = []
  const dropped: string[] = []
  const seen = new Set<string>()
  let depth = 0
  while (inbox.length) {
    const file = inbox.shift()
    if (!file || seen.has(file.path)) continue
    seen.add(file.path)
    const read = readIdea(file)
    const tree = ideaTree(read.statement)
    if (!tree.statement) { dropped.push(file.path); continue }
    const developed = develop({ formula: tree.statement, product: read.product, variant: read.variant, title: read.title })
    drained.push({ path: file.path, text: written({ source: read.source, title: read.title, statement: tree.statement }, developed, tree.children) })
    const id = `idea-${file.path.slice(`${IDEA_INBOX}/`.length).replace(/\.txt$/, '').replace(/\//g, '-')}`
    leads.push({ id, path: file.path, source: read.source, statement: tree.statement, status: 'open', tool: 'payload', reason: 'developed in .idea and removed', depth: file.at, run: { tool: 'payload', arguments: { develop: { formula: tree.statement, product: read.product, variant: read.variant, title: read.title } } }, developed })
    if (file.at > depth) depth = file.at
    for (const child of tree.children) {
      const path = childPath(file.path, child.statement)
      if (seen.has(path)) continue
      const nested = child.children.length ? `\n${linesOf(child.children, 1)}` : ''
      inbox.push({ path, text: `source: ${read.source}\ntitle: ${child.statement}\n\n${child.statement}${nested}\n`, at: file.at + 1 })
    }
  }
  const files: { path: string; text: string }[] = []
  const outside = placed.filter((file) => !underIdea(file.path)).map((file) => file.path)
  const counts = { served: 0, partial: 0, blocked: 0, out_of_scope: 0, open: leads.length }
  const empty = files.length === 0 && outside.length === 0
  const mcp = raw === 'life' ? isoApprovedMcp() : null
  return { phase: 'next' as const, recursive: true as const, home: IDEA_HOME, inbox: IDEA_INBOX, depth, empty, files, drained, dropped, leads, left: files.map((file) => file.path), outside, counts, total: leads.length, ...(mcp ? { mcp } : {}), ...ISO_EXIT, says: empty ? `${IDEA_HOME} is empty. ${leads.length} lead(s) developed and removed. ${ISO_EXIT.count} exit codes, starting at 0, each an ISO 9001 strategy. ${ISO_EXIT.cover.entries.length} entries cover ${ISO_EXIT.cover.exits} exits${mcp ? ` The only door is ${mcp.plugin}.` : ''}` : `${files.length} file(s) remain in ${IDEA_HOME}. ${ISO_EXIT.cover.entries.length} entries cover ${ISO_EXIT.cover.exits} exits` }
}
