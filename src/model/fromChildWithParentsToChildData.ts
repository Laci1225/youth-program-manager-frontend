import {ChildDataWithParents} from "@/model/child-data";

export default function fromChildWithParentsToChildData(childWithParents: ChildDataWithParents) {
    return {
        id: childWithParents.id,
        familyName: childWithParents.familyName,
        givenName: childWithParents.givenName,
        birthDate: childWithParents.birthDate,
        birthPlace: childWithParents.birthPlace,
        address: childWithParents.address,
        relativeParents: childWithParents.parents?.map(value => ({
            id: value.parentDto.id,
            isEmergencyContact: value.isEmergencyContact,
        })) ?? [],
        diagnosedDiseases: childWithParents.diagnosedDiseases,
        regularMedicines: childWithParents.regularMedicines,
        createdDate: childWithParents.createdDate,
        modifiedDate: childWithParents.modifiedDate,
        hasDiagnosedDiseases: childWithParents.hasDiagnosedDiseases,
        hasRegularMedicines: childWithParents.hasRegularMedicines
    }
}