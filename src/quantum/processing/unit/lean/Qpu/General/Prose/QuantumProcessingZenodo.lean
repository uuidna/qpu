/-! # Qpu.General.Prose.QuantumProcessingZenodo
The prose of `src/quantum/processing/zenodo.ts`. Each definition is one sentence, read in TypeScript by its name from prose-index.ts;
`⟦n⟧` marks where the nth computed value goes. -/

namespace Prose

def quantumProcessingZenodo_s1 : String := "isIdenticalTo ⟦0⟧: a Zenodo version DOI is never identical-to; use isVersionOf → conceptdoi"
def quantumProcessingZenodo_s2 : String := "isVersionOf ⟦0⟧: parent must be the conceptdoi ⟦1⟧, not a version DOI"
def quantumProcessingZenodo_s3 : String := "deposit:write deposit:actions user:email"
def quantumProcessingZenodo_beforeOperation4 : String := "the tenant application and the user token are named before the operation"
def quantumProcessingZenodo_beforeRead5 : String := "the user reads their own deposits"
def quantumProcessingZenodo_beforeValidate6 : String := "access, communities, the title and the file names are checked before the write"
def quantumProcessingZenodo_s7 : String := "a published post with a file may be deposited; a draft is not"
def quantumProcessingZenodo_afterChange8 : String := "the deposit is created, its file is posted, and then it is published"
def quantumProcessingZenodo_afterRead9 : String := "the loaded record is served: family and given name, the ORCID, the licence and the access"
def quantumProcessingZenodo_beforeDelete10 : String := "the owner may delete a draft; a published record is no longer a draft"
def quantumProcessingZenodo_afterDelete11 : String := "a draft the owner may delete is deleted"
def quantumProcessingZenodo_afterOperation12 : String := "the operation answers with the status Zenodo gave"
def quantumProcessingZenodo_s13 : String := "a refusal is recorded and not retried"
def quantumProcessingZenodo_beforeLogin14 : String := "the user token is named before it is bound to the application"
def quantumProcessingZenodo_afterLogin15 : String := "the token is bound when its client id is the application"
def quantumProcessingZenodo_beforeLogout16 : String := "the token leaves the operation"
def quantumProcessingZenodo_me17 : String := "the caller is the owner, a user slug"
def quantumProcessingZenodo_afterMe18 : String := "the owner reads their own deposits"
def quantumProcessingZenodo_afterRefresh19 : String := "the access token stays a name"
def quantumProcessingZenodo_afterForgotPassword20 : String := "user:email is a scope id on ⟦0⟧. No address is written"
def quantumProcessingZenodo_beforeDuplicate21 : String := "a duplicated post is a draft and is not deposited"
def quantumProcessingZenodo_says22 : String := "a post without a tenant is not deposited"
def quantumProcessingZenodo_says23 : String := "the published record opens a new draft under conceptdoi ⟦0⟧; Zenodo mints the next version DOI on publish"
def quantumProcessingZenodo_says24 : String := "a claim that is not novel is not deposited"
def quantumProcessingZenodo_says25 : String := "a draft stays on the site until it is published"
def quantumProcessingZenodo_says26 : String := "a published post without a title is not deposited"
def quantumProcessingZenodo_says27 : String := "the deposit is created, a file is posted, and only then is it published"
def quantumProcessingZenodo_note28 : String := "the record id is the deposit id. A second publish is not sent"
def quantumProcessingZenodo_says29 : String := "the published post is deposited with ⟦0⟧ and cites ⟦1⟧"
def quantumProcessingZenodo_why30 : String := "the tenant names its domain"
def quantumProcessingZenodo_says31 : String := "a free account is authored by the tenant domain"
def quantumProcessingZenodo_says32 : String := "a free account waits until every link is verified"
def quantumProcessingZenodo_says33 : String := "the free account deposits the post as ⟦0⟧"

end Prose
